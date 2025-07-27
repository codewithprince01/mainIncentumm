require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");



// Function to connect to MongoDB
const connectToDatabase = async () => {
  try {
    // Attempt to connect to MongoDB with updated settings
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Reduced timeout to 5 seconds
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    console.log("Server will continue running without MongoDB connection.");
    console.log("Note: Database operations will not work until MongoDB is available.");
    // Don't exit the process, just log the error and continue
  }
};

module.exports = { connectToDatabase };
