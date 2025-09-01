const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Example regex: requires at least one special character
// (you can extend this to match Admin’s rule or make it same as needed)
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!passwordRegex.test(this.password)) {
    const error = new Error(
      "Password must contain at least one special character"
    );
    return next(error);
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.error("Error hashing password", err);
    next(err);
  }
});

// Validate password
adminSchema.methods.isValidPassword = async function (password) {
  const trimmedPassword = password.trim();
  return await bcrypt.compare(trimmedPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema, "admins");
module.exports = Admin;
