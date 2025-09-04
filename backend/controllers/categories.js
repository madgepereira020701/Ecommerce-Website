const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Category = require("../models/categories");

// ✅ Add Product
const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const createdBy = req.user;

    if (!createdBy) {
      return res
        .status(401)
        .json({ message: "Invalid or missing token. Admin not found." });
    }

    if (!category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCategory = new Category({
      category,
      createdBy,
    });

    await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Products (by admin)
const getCategories = async (req, res) => {
  try {
    const createdBy = req.user;
    const categories = await Category.find({ createdBy });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    return res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // no filter
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No products available" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Delete Product
const deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const deletedCategory = await Category.findOneAndDelete({ category });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Product
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params._id;
    const { category } = req.body;
    const createdBy = req.user;

    if (!createdBy) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const thecategory = await Category.findOne({ _id: categoryId, createdBy });
    if (!thecategory) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category) thecategory.category = category;

    await thecategory.save();

    return res
      .status(200)
      .json({ message: "Category updated successfully", thecategory });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getAllCategories,
};
