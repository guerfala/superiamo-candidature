// pages/dashboard.tsx
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import UserInfoForm from "./UserInfoForm";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to signin if user is not authenticated
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // Optional loading state
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <UserInfoForm />
      <button onClick={() => signOut({ callbackUrl: "/signin" })}>
        Sign out
      </button>
    </div>
  );
};

export default Dashboard;
