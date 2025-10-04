import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const PaymentPage = () => {
  const location = useLocation();
  const { product } = location.state || {};

  const [address, setAddress] = useState("");
    const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [newAddress, setNewAddress] = useState("");


useEffect(() => {
  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("No userId found in localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3000/${userId}/address`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch address");

      const data = await res.json();
      setAddress(data.address || "No address saved yet");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchAddress();
}, []);

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
      const res = await fetch(`http://localhost:3000/${userId}/address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!res.ok) throw new Error("Failed to update address");

      const data = await res.json();
      setAddress(data.address);
      setEditing(false);
      alert("Address updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };


  if (!product) return <p>No product selected for payment.</p>;
  if (loading) return <p>Loading address...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout title="Payment">
      <div className="container">
        <h2>Payment Page</h2>

        {/* Address Section */}
        <div className="card p-3 mb-3">
          <h5>Delivery Address</h5>

          {editing ? (
            <>
              <input
                type="text"
                className="form-control mb-2"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <button className="btn btn-success btn-sm me-2" onClick={handleSaveAddress}>
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditing(false);
                  setNewAddress(address);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>{address}</p>
              <button className="btn btn-warning btn-sm" onClick={() => setEditing(true)}>
                Change Address
              </button>
            </>
          )}
        </div>

        {/* Product Section */}
        <div className="card p-3">
          <h4>{product.name}</h4>
          <p>Price: ₹{product.price}</p>
          <p>Quantity: {product.quantity}</p>
          <button className="btn btn-success">Pay with Google Pay</button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;


