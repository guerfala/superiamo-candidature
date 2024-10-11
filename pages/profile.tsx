// pages/profile.tsx
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateDeNaissance, setDateDeNaissance] = useState('');
  const [adresse, setAdresse] = useState('');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log(session);
    if (session) {
      setNom(session.user.lastName || '');
      setPrenom(session.user.firstName || '');
      setDateDeNaissance(session.user.dateDeNaissance || '');
      setAdresse(session.user.adresse || '');
      setNumeroDeTelephone(session.user.numeroDeTelephone || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // Ensure session and access token are available
    if (!session || !session.user.accessToken) {
      console.error('No access token found');
      setErrorMessage('Access token is missing.');
      return;
    }
  
    // Prepare the updated profile data
    const updatedProfile = {
      id: session.user.id, // Use the user ID from the session
      firstName: prenom,
      lastName: nom,
      dateDeNaissance,
      adresse,
      numeroDeTelephone,
      email: session.user.email, // Assuming email is stored in the session
    };
  
    setLoading(true);
    setErrorMessage('');
  
    try {
      const response = await fetch('./api/users', {
        method: 'PUT', // Change to PUT for updating user data
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`, // Add the authorization token here
        },
        body: JSON.stringify(updatedProfile), // Send updated profile
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Profile updated successfully');
        setIsEditing(false);
      } else {
        console.error('Error:', data.message);
        setErrorMessage(data.message || 'Failed to update profile.'); // Display error message
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('An error occurred while saving the profile.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      {session ? (
        <div style={styles.infoContainer}>
          {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
          <p style={styles.infoText}><strong>Email:</strong> {isEditing ? (
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            session.user.email
          )}</p>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Nom:</label>
            {isEditing ? (
              <input
                style={styles.input}
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            ) : (
              <p style={styles.infoText}>{nom || 'N/A'}</p>
            )}
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Prénom:</label>
            {isEditing ? (
              <input
                style={styles.input}
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            ) : (
              <p style={styles.infoText}>{prenom || 'N/A'}</p>
            )}
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Date de naissance:</label>
            {isEditing ? (
              <input
                style={styles.input}
                type="date"
                value={dateDeNaissance}
                onChange={(e) => setDateDeNaissance(e.target.value)}
              />
            ) : (
              <p style={styles.infoText}>{dateDeNaissance || 'N/A'}</p>
            )}
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Adresse:</label>
            {isEditing ? (
              <input
                style={styles.input}
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
              />
            ) : (
              <p style={styles.infoText}>{adresse || 'N/A'}</p>
            )}
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Numéro de téléphone:</label>
            {isEditing ? (
              <input
                style={styles.input}
                type="text"
                value={numeroDeTelephone}
                onChange={(e) => setNumeroDeTelephone(e.target.value)}
              />
            ) : (
              <p style={styles.infoText}>{numeroDeTelephone || 'N/A'}</p>
            )}
          </div>
          <div style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <button style={styles.saveButton} onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button style={styles.cancelButton} onClick={handleEditToggle}>Cancel</button>
              </>
            ) : (
              <>
                <button style={styles.editButton} onClick={handleEditToggle}>Edit Profile</button>
                <button style={styles.logoutButton} onClick={() => signOut({ callbackUrl: "/signin" })}>Logout</button>
              </>
            )}
          </div>
        </div>
      ) : (
        <p style={styles.notLoggedInText}>You are not logged in.</p>
      )}
    </div>
  );
};

// Styles for the Profile page
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
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "400px",
    textAlign: "left",
  },
  inputContainer: {
    marginBottom: "1rem",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  infoText: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
  },
  editButton: {
    backgroundColor: "#0070f3",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  saveButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  logoutButton: {
    backgroundColor: "#ff5a5f",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    border: "none",
  },
  notLoggedInText: {
    fontSize: "1.25rem",
    color: "#ff5a5f",
  },
  errorText: {
    color: "#dc3545",
    marginBottom: "1rem",
  },
};

export default Profile;
