import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignIn = () => {
    // Redirect to the dashboard after sign in
    signIn("google", { callbackUrl: "/dashboard" });
  };

  if (session) {
    // Redirect to the dashboard if already signed in
    router.push("/dashboard");
    return null; // Prevent rendering the page
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome</h1>
        <button style={styles.button} onClick={handleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

// Styles for the components
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4", // Background color can be adjusted
  },
  card: {
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center" as React.CSSProperties["textAlign"], // Type assertion to satisfy TypeScript
  },
  title: {
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#4285F4", // Google sign-in button color
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SignInPage;
