import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";

const UserProducts = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(""); // ✅ message state

  useEffect(() => {
    const fetchPublicProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/userproducts");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.data)) setProducts(data.data);
        else console.error("Unexpected API response:", data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchPublicProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const res = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add to cart");

      // ✅ Show success message
      setMessage(`✅ "${product.name}" added to cart successfully!`);

      // Optionally, redirect after a short delay
      // setTimeout(() => navigate(`/cart/${userId}`), 1000);

    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage(`❌ Failed to add "${product.name}" to cart: ${err.message}`);
    }
  };

  return (
    <Layout title="Available Products">
      <div className="container">
        <h1 className="my-3">Available Products</h1>

        {/* ✅ Display message */}
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="col-md-3 mb-3">
                <div className="card h-100" style={{ fontSize: "0.85rem", padding: "5px" }}>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body p-2">
                    <h6 className="card-title mb-1">{product.name}</h6>
                    <p className="mb-1"><strong>₹{product.price}</strong></p>
                    <p className="mb-1">Category: {product.category}</p>
                    <p className="mb-2">Stock: {product.stock}</p>

                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-success"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProducts;
