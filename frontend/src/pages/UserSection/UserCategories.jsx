import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

const UserCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPublicCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/usercategories");
        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Unexpected API response:", data);
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchPublicCategories();
  }, []);

  return (
    <div className="container">
      <h2>Available Categories</h2>
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
          <p>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default UserCategories;
