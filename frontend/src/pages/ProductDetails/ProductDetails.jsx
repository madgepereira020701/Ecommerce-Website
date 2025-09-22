import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/products/${encodeURIComponent(name)}`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [name]);

  if (loading) return <h2 className="loading">Loading product...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="product-details">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-title">{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="product-price">₹{product.price}</p>

        <p className="product-meta">
          <b>Category:</b> {product.category}
        </p>
        <p className="product-meta">
          <b>Stock:</b> {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        <div className="actions">
          <button className="btn-primary">Add to Cart</button>
          <button className="btn-secondary">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
