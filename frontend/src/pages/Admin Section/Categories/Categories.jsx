import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout/Layout";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // store _id for update

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const body = { category: form.category };

      let url = "http://localhost:3000/categories";
      let method = "POST";

      if (editingId) {
        url = `http://localhost:3000/categories/${editingId}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save category");
      }

      await fetchCategories();
      setForm({ category: "" });
      setShowForm(false);
      setEditingId(null);
      alert(editingId ? "Category updated successfully!" : "Category added successfully!");
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.message);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (category) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/categories/${category}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete category");
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ✅ Prepare form for editing
  const handleEdit = (thecategory) => {
    setForm({ category: thecategory.category });
    setShowForm(true);
    setEditingId(thecategory._id); // store id for update
  };

  return (
    <Layout title="Categories">
      <div className="container">
        <h1 className="my-3">Categories</h1>
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm
            ? "Close Form"
            : editingId
            ? "Edit Category"
            : "Add Category"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />
            <button type="submit" className="btn btn-success">
              {editingId ? "Update Category" : "Save Category"}
            </button>
          </form>
        )}

        <div className="row">
          {categories?.map((thecategory) => (
            <div key={thecategory._id} className="col-12 mb-2">
              <div className="card-body p-2 d-flex justify-content-between align-items-center">
                <p className="mb-0">{thecategory.category}</p>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(thecategory)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(thecategory.category)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
