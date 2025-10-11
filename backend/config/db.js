const mongoose = require("mongoose");

mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error:", err);
});

const mongoURI = "";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      connectTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit if the connection fails
  }
};

module.exports = connectDB;
