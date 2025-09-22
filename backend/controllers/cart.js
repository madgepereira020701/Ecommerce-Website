const Cart = require("../models/Cart");
const Product = require("../models/products"); // your product model

// Add item to cart
const additemtocart = async (req, res) => {
  try {
    const userId = req.user.userId; // from token
    const { productId, quantity } = req.body;

    // 1️⃣ Fetch product details from Product model
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2️⃣ Find or create cart for this user
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, products: [] });

    // 3️⃣ Check if product already exists in cart
    const existingIndex = cart.products.findIndex((p) =>
      p.productId.equals(productId)
    );
    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += quantity || 1;
    } else {
      // 4️⃣ Push full product details into cart
      cart.products.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity || 1,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get cart for a user
const getusercart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { additemtocart, getusercart };
