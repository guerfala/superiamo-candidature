import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { validateAddress } from "./api/validateAddress"; // Ensure this path is correct
import Link from "next/link";

const Dashboard = () => {
  const { data: session, status } = useSession(); // Get session and status from useSession
  const router = useRouter();
  const [isInZone, setIsInZone] = useState<boolean | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to sign-in page if not authenticated
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (status === "authenticated") {
      getUserLocation();
    }
  }, [status, session]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setAddress(address);
        validateUserAddress(address); // Trigger address validation
      }, (error) => {
        console.error("Error retrieving location:", error);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`);
    const data = await response.json();
    return data.display_name || "Adresse non trouvée";
  };

  const validateUserAddress = async (address: string) => {
    try {
      console.log("Validating address:", address); // Debug: log the address
      const isValid = await validateAddress(address); // Call the function to validate the address
      console.log("Validation result:", isValid); // Debug: log the result
      setIsInZone(isValid);
    } catch (error) {
      console.error("Error validating address:", error);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress(e.target.value);
  };

  const handleAddressConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress) {
      const isValid = await validateAddress(newAddress);
      setIsInZone(isValid); // Check if the new address is in the zone
      setAddress(newAddress); // Update the displayed address

      // Validate the user address again after confirming
      validateUserAddress(newAddress);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Show a loading state while session is being fetched
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>; // Show access denied if user is not authenticated
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session?.user?.name || session?.user?.email}</p>

      {/* Sign out button with callback to redirect to sign-in page */}
      <button onClick={() => signOut({ callbackUrl: "/signin" })}>Sign out</button>

      {/* Button to navigate to Profile page */}
      <Link href="/profile">
        <button>Go to Profile</button>
      </Link>

      {/* Address confirmation form */}
      {address && (
        <form onSubmit={handleAddressConfirm}>
          <label>
            Your address:
            <input type="text" value={newAddress || address} onChange={handleAddressChange} />
          </label>
          <button type="submit">Confirm Address</button>
        </form>
      )}

      {/* Show Zone Information */}
      {isInZone !== null ? (
        <p>{isInZone ? "You are in the zone of Paris" : "You are not in the zone"}</p>
      ) : (
        <p>Loading zone information...</p>
      )}
    </div>
  );
};

export default Dashboard;
