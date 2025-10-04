import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:3000/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAdmin(data);
    };
    fetchAdmin();
  }, []);

  if (!admin) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Profile</h1>
      <p><b>Name:</b> {admin.name}</p>
      <p><b>Email:</b> {admin.email}</p>
      <p><b>Role:</b> Admin</p>
    </div>
  );
};

export default AdminProfile;
