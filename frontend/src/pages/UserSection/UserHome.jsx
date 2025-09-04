import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";

const UserHome = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // ✅ Fetch categories (public)
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/usercategories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();

      // Handle array vs object response
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch products (public)
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/userproducts");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <Layout title={"Best offers"}>
      {/* Hero Section */}
      <section className="text-center py-10 bg-light">
        <h1 className="display-4 fw-bold">Welcome to Our Store</h1>
        <p className="lead text-muted">
          Discover amazing products at unbeatable prices 🚀
        </p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          Shop Now
        </Link>
      </section>

      {/* Categories Section */}
      <section className="container py-5">
        <h2 className="mb-4">Shop by Categories</h2>
        <div className="row">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat._id} className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <img
                    src={cat.image || "https://via.placeholder.com/400x250"}
                    className="card-img-top"
                    alt={cat.category}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{cat.category}</h5>
                    <Link
                      to={`/category/${cat.category}`}
                      className="btn btn-outline-primary"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container py-5">
        <h2 className="mb-4">Featured Products</h2>
        <div className="row">
          {products.length > 0 ? (
            products.slice(0, 3).map((product) => (
              <div key={product._id} className="col-md-4 mb-3">
                <div className="card shadow-sm h-100">
                  {product.image && (
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="fw-bold">₹{product.price}</p>
                    <Link
                      to={`/product/${product.name}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default UserHome;
