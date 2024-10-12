// Dashboard.tsx
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
  const [newAddress, setNewAddress] = useState<string>(""); // State for new address input

  useEffect(() => {
    // Redirect to sign-in page if not authenticated
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (status === "authenticated") {
      // Once authenticated, fetch the user's location
      getUserLocationAndUpdateDatabase(); // Automatically save address after sign-in
    }
  }, [status, router]); // Removed session from dependencies

  useEffect(() => {
    // Save user info only once when the component mounts
    if (status === "authenticated") {
      saveUserInfo(); // Save user info after successful sign-in
    }
  }, [status]); // Only dependent on status

  const saveUserInfo = async () => {
    if (session?.user) {
      const { name, email } = session.user; // Get user name and email from session
      const [prenom, nom] = name?.split(' ') || ['Unknown', 'Unknown']; // Split name into first and last name

      try {
        const response = await fetch('/api/saveUser', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom, prenom, email }), // Send user data to API
        });

        if (!response.ok) {
          throw new Error('Failed to save user information');
        }

        console.log('User information saved successfully.');
      } catch (error) {
        console.error("Error saving user information:", error);
      }
    }
  };

  const getUserLocationAndUpdateDatabase = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get human-readable address
        const address = await reverseGeocode(latitude, longitude);
        setAddress(address); // Update the displayed address
        setNewAddress(address); // Set the new address input with the detected address

        // Save the address to the database immediately
        await saveAddressToDatabase(address);

        // Validate if the address is within the 50km zone
        validateUserAddress(address);
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

  const saveAddressToDatabase = async (address: string) => {
    try {
      const response = await fetch('/api/saveAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.email}`, // Pass the user's email in the headers
        },
        body: JSON.stringify({ address }), // Send detected address to API
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      console.log('Address saved successfully.');
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleChangeAddress = async () => {
    if (newAddress) {
      await saveAddressToDatabase(newAddress);
      setAddress(newAddress); // Update displayed address with new address
      validateUserAddress(newAddress); // Validate the new address
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

      {/* Address display */}
      {address && (
        <p>Your detected address: {address}</p>
      )}

      {/* Address input and button to change address */}
      <input
        type="text"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
        placeholder="Change your address"
        style={styles.addressInput}
      />
      <button style={styles.changeAddressButton} onClick={handleChangeAddress}>
        Change Address
      </button>

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
  addressInput: {
    padding: "0.5rem",
    fontSize: "1rem",
    width: "300px",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  changeAddressButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4CAF50",
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
