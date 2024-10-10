// pages/profile.tsx
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

const Profile = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(session?.user.lastName || ''); // Adjusted to use 'nom'
  const [prenom, setPrenom] = useState(session?.user.firstName || ''); // Adjusted to use 'prenom'
  const [dateDeNaissance, setDateDeNaissance] = useState(session?.user.dateDeNaissance || '');
  const [adresse, setAdresse] = useState(session?.user.adresse || '');
  const [numeroDeTelephone, setNumeroDeTelephone] = useState(session?.user.numeroDeTelephone || '');
  const [email, setEmail] = useState(session?.user.email || ''); // New state for email

  useEffect(() => {
    if (session) {
      // Set initial values when the session changes
      setNom(session.user.lastName!);
      setPrenom(session.user.firstName!);
      setDateDeNaissance(session.user.dateDeNaissance!);
      setAdresse(session.user.adresse!);
      setNumeroDeTelephone(session.user.numeroDeTelephone!);
      setEmail(session.user.email); // Set email when session updates
    }
  }, [session]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here you can add a function to save the edited information to your database.
    console.log("Saving new info:", { nom, prenom, dateDeNaissance, adresse, numeroDeTelephone, email });
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>
      {session ? (
        <div style={styles.infoContainer}>
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
                <button style={styles.saveButton} onClick={handleSave}>Save</button>
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
  infoText: {
    fontSize: "1rem",
    margin: "0.5rem 0",
  },
  inputContainer: {
    margin: "1rem 0",
  },
  label: {
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  buttonContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
  },
  editButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4285F4",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#ff9800",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#ff5252",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  notLoggedInText: {
    fontSize: "1rem",
    color: "#ff5252",
  },
};

export default Profile;
