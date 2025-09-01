// Example using React
import { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
const fetchAdmin = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/api/admin/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAdmin(res.data.admin);
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error);
  }
};

    fetchAdmin();
  }, []);

  if (!admin) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>Admin Profile</h2>
      <p><strong>Name:</strong> {admin.username}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Phone:</strong> {admin.phone}</p>
      <p><strong>Address:</strong> {admin.address}</p>
    </div>
  );
};

export default AdminProfile;
