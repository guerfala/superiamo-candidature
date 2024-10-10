// Example: pages/profile.tsx
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Profile</h1>
      {session ? (
        <div>
          <p>Email: {session.user.email}</p>
          <p>First Name: {session.user.firstName ? session.user.firstName : 'N/A'}</p>
          <p>Last Name: {session.user.lastName ? session.user.lastName : 'N/A'}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
