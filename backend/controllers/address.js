// Get user address (from token, no ID required)
const User = require("../models/user");
const getAddress = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from token
    const user = await User.findById(userId).select("address");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ address: user.address }); // ✅ return only address
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from token
    const { address } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { address },
      { new: true }
    ).select("address");

    res.json({ address: user.address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAddress, updateAddress };
