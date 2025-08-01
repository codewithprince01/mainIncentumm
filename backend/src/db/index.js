require("dotenv").config();
const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }

    console.log("Attempting to connect to MongoDB Atlas...");

    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: true, // ✅ Only use this for dev on Windows
    });

    console.log("✅ Connected to MongoDB Atlas successfully!");
    console.log("Database:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    console.log("Server will continue running without MongoDB connection.");
    console.log("Note: Database operations will not work until MongoDB is available.");
  }
};

module.exports = { connectToDatabase };
