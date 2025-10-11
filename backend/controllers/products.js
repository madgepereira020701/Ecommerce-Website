const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Product = require("../models/products");

// Storage config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // ensure folder exists
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const createdBy = req.admin.id;

    if (!createdBy) {
      return res
        .status(401)
        .json({ message: "Invalid or missing token. Admin not found." });
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let imageUrl = "";

    if (image) {
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return res
          .status(400)
          .json({ message: "Invalid base64 image format." });
      }

      const extension = matches[1];
      const base64Data = matches[2];
      const filename = `${Date.now()}.${extension}`;
      const filePath = path.join(__dirname, "..", "uploads", filename);

      try {
        // Ensure uploads folder exists
        const uploadDir = path.join(__dirname, "..", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(filePath, base64Data, "base64");
        imageUrl = `http://localhost:3000/uploads/${filename}`;
      } catch (fileErr) {
        console.error("Error writing image to disk:", fileErr);
        return res.status(500).json({ message: "Failed to save image file." });
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: imageUrl,
      createdBy,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Products (by admin)
const getProducts = async (req, res) => {
  try {
    const createdBy = req.admin.id;
    const products = await Product.find({ createdBy });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Product Details
const getProductDetails = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error in getProductDetails:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all products (visible to all customers)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // no filter
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products available" });
    }
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ name });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (deletedProduct.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        deletedProduct.image.replace("http://localhost:3000/", "")
      );

      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params._id;
    const { name, description, price, category, stock, image } = req.body;
    const createdBy = req.admin;

    if (!createdBy) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const product = await Product.findOne({ _id: productId, createdBy });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;

    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  upload,
  addProduct,
  getProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
  getAllProducts,
};
