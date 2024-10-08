import { signIn, signOut, useSession } from "next-auth/react";
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
    <div>
      <p>Not signed in</p>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default SignInPage;
