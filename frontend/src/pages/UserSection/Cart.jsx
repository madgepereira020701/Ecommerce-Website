import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Step 1
import Layout from "../../components/Layout/Layout";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ✅ Step 2

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Step 2: Handle navigation to payment page
  const handleBuyNow = (item) => {
    navigate("/payment", { state: { product: item } });
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout title="My Cart">
      <div className="container">
        <h1 className="my-3">My Cart</h1>

        {cart && cart.products && cart.products.length > 0 ? (
          <div className="row">
            {cart.products.map((item, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card h-100">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>

                    {/* ✅ Step 3: Buy Now Button */}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBuyNow(item)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
