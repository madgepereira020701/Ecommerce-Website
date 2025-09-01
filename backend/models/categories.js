const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // who added the product
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
