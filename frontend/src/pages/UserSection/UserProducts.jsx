import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";

const UserProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPublicProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/userproducts");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // ✅ Handle both array and {data: []} API responses
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          console.error("Unexpected API response:", data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchPublicProducts();
  }, []);

  return (
    <Layout title="Available Products">
      <div className="container">
        <h1 className="my-3">Available Products</h1>

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
                    <button type="submit" className="btn btn-success">Add to Cart</button>
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
