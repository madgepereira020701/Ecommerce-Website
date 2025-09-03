const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const path = require("path");
const multer = require("multer");
const authcontroller = require("./controllers/auth");
const userprotect = require("./middlewares/user");
const productcontroller = require("./controllers/products");
const categorycontroller = require("./controllers/categories");

const protect = require("./middlewares/auth");

const app = express();
const port = 3000;

// ✅ Connect to DB
connectDB();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());

// ✅ Serve Static Files for Image Access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // saves files inside /uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // unique filename
  },
});
const upload = multer({ storage });

// ✅ Image Upload Route
app.post("/upload", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct image URL for frontend access
  const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.status(200).json({ url: imageUrl });
});

// ✅ Auth Routes
app.post("/adminregister", authcontroller.adminregister);
app.post("/adminlogin", authcontroller.adminlogin);
app.post("/passwordreset", authcontroller.passwordresetrequest);
app.post("/updatepassword/:token", authcontroller.updatePassword);

app.post("/userregister", authcontroller.userregister);
app.post("/userlogin", authcontroller.userlogin);

// ✅ Product Routes
app.post("/products", protect, productcontroller.addProduct);
app.get("/products", protect, productcontroller.getProducts);
app.get("/products/:name", protect, productcontroller.getProductDetails);
app.get("/userproducts", productcontroller.getAllProducts);
app.delete("/products/:name", protect, productcontroller.deleteProduct);
app.patch("/products/:_id", protect, productcontroller.updateProduct);

// ✅ Category Routes
app.post("/categories", protect, categorycontroller.addCategory);
app.get("/categories", protect, categorycontroller.getCategories);
app.delete("/categories/:category", protect, categorycontroller.deleteCategory);
app.patch("/categories/:_id", protect, categorycontroller.updateCategory);
app.get("/usercategories", categorycontroller.getAllCategories);

// ✅ Start Server
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
