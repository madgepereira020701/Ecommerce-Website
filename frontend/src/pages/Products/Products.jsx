import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null, // file or null
  });
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // store _id for update

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject("Failed to convert image");
    });
  };

  // ✅ Add or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let base64Image = null;

      if (form.image) base64Image = await convertToBase64(form.image);

      const body = {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        stock: form.stock,
        image: base64Image,
      };

      let url = "http://localhost:3000/products";
      let method = "POST";

      if (editingId) {
        url = `http://localhost:3000/products/${editingId}`;
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
        throw new Error(err.message || "Failed to save product");
      }

      await fetchProducts();
      setForm({ name: "", description: "", price: "", category: "", stock: "", image: null });
      setPreview(null);
      setShowForm(false);
      setEditingId(null);
      alert(editingId ? "Product updated successfully!" : "Product added successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message);
    }
  };

  // ✅ Delete Product
  const handleDelete = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/products/${name}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete product");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ✅ Prepare form for editing
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: null, // new image optional
    });
    setPreview(product.image);
    setShowForm(true);
    setEditingId(product._id); // store id for update
  };

  return (
    <Layout title="Products">
      <div className="container">
        <h1 className="my-3">Products</h1>
        <button className="btn btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : editingId ? "Edit Product" : "Add Product"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4">
            <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="form-control mb-2" />
            <textarea name="description" placeholder="Product Description" value={form.description} onChange={handleChange} required className="form-control mb-2" />
            <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="form-control mb-2" />
            <input type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="form-control mb-2" />
            <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required className="form-control mb-2" />

            <input type="file" accept="image/*" onChange={handleImage} className="form-control mb-2" />
            {preview && <img src={preview} alt="Preview" width="100" className="mb-2" />}

            <button type="submit" className="btn btn-success">{editingId ? "Update Product" : "Save Product"}</button>
          </form>
        )}

<div className="row">
  {products?.map((product) => (
    <div key={product._id} className="col-md-3 mb-3"> {/* smaller width */}
      <div className="card h-100" style={{ fontSize: "0.85rem", padding: "5px" }}>
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
            style={{ height: "150px", objectFit: "cover" }} // smaller image
          />
        )}
        <div className="card-body p-2">
          <h6 className="card-title mb-1">{product.name}</h6>
          <p className="mb-1"><strong>₹{product.price}</strong></p>
          <p className="mb-1 ">Category: {product.category}</p>
          <p className="mb-2">Stock: {product.stock}</p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleEdit(product)}
            >
              Update
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(product.name)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </Layout>
  );
};

export default Products;
