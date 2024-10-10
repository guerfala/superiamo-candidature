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
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        {/* Sign out button with callback to redirect to sign-in page */}
        <button style={styles.signOutButton} onClick={() => signOut({ callbackUrl: "/signin" })}>
          Sign out
        </button>

        {/* Button to navigate to Profile page */}
        <Link href="/profile">
          <button style={styles.profileButton}>Go to Profile</button>
        </Link>
      </div>

      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.welcomeText}>Welcome, {session?.user?.name || session?.user?.email}</p>

      {/* Address confirmation form */}
      {address && (
        <form onSubmit={handleAddressConfirm} style={styles.form}>
          <label style={styles.label}>
            Your address:
            <input 
              type="text" 
              value={newAddress || address} 
              onChange={handleAddressChange} 
              style={styles.input} 
            />
          </label>
          <button type="submit" style={styles.confirmButton}>Confirm Address</button>
        </form>
      )}

      {/* Show Zone Information */}
      {isInZone !== null ? (
        <p style={{ ...styles.zoneInfo, color: isInZone ? "green" : "red" }}>
          {isInZone ? "You are in the zone (50Km of Paris)" : "You are not in the zone (50Km of Paris)"}
        </p>
      ) : (
        <p>Loading zone information...</p>
      )}
    </div>
  );
};

// Styles for the components
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  buttonContainer: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    gap: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  welcomeText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  signOutButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#ff5252",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  profileButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4285F4",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "2rem",
  },
  label: {
    marginBottom: "0.5rem",
    fontSize: "1rem",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "1rem",
    width: "600px",
    marginLeft: "10px"
  },
  confirmButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#34A853",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  zoneInfo: {
    fontSize: "2rem",
    marginTop: "1rem",
  },
};

export default Dashboard;
