import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/products/${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [name]);

  if (loading) return <h2>Loading product...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p><b>Description:</b> {product.description}</p>
      <p><b>Price:</b> ₹{product.price}</p>
      <p><b>Category:</b> {product.category}</p>
      <p><b>Stock:</b> {product.stock}</p>
      {product.image && <img src={product.image} alt={product.name} width="200" />}
    </div>
  );
};

export default ProductDetails;
