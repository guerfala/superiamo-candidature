// Profile.tsx
import { useSession } from "next-auth/react";
import { useState } from "react";

const Profile = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState({
    name: session?.user?.name || "",
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    dateOfBirth: session?.user?.dateOfBirth || "",
    address: session?.user?.address || "",
    phoneNumber: session?.user?.phoneNumber || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform the update operation here, such as making an API call to update user info
    console.log("Updated user info:", user);
  };

  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={user.name} onChange={handleInputChange} />

        <label>First Name</label>
        <input type="text" name="firstName" value={user.firstName} onChange={handleInputChange} />

        <label>Last Name</label>
        <input type="text" name="lastName" value={user.lastName} onChange={handleInputChange} />

        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleInputChange} />

        <label>Address</label>
        <input type="text" name="address" value={user.address} onChange={handleInputChange} />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleInputChange} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
