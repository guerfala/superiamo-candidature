import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignInPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && status === "authenticated") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Optional: show a loading state while checking session
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  card: {
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
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
    backgroundColor: "#4285F4",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SignInPage;
