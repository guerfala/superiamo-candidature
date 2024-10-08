import { useState } from "react";

const UserInfoForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    birthDate: "",
    address: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Perform API call here to update user information
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={userData.name}
        onChange={handleInputChange}
      />
      <input
        name="surname"
        placeholder="Surname"
        value={userData.surname}
        onChange={handleInputChange}
      />
      <input
        name="birthDate"
        type="date"
        value={userData.birthDate}
        onChange={handleInputChange}
      />
      <input
        name="address"
        placeholder="Address"
        value={userData.address}
        onChange={handleInputChange}
      />
      <input
        name="phone"
        placeholder="Phone Number"
        value={userData.phone}
        onChange={handleInputChange}
      />
      <button type="submit">Update Information</button>
    </form>
  );
};

export default UserInfoForm;
