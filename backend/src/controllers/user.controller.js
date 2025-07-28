const { User } = require("../models/authentication/User.models"); // Mongoose model
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// Load environment variables
require('dotenv').config();

// Function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Avoid validation for speed

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error.message, error.stack);
    throw new ApiError(500, "Failed to generate access and refresh tokens");
  }
};

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, pincode, password, confirmpassword } = req.body;

  console.log("Register request body:", req.body);

  if (!name || !email || !phoneNumber || !pincode || !password || !confirmpassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (password !== confirmpassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists! Please login.");
  }

  const newUser = new User({ name, email, phoneNumber, pincode, password });
  console.log("New user document:", newUser);
  await newUser.save();

  const userResponse = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    pincode: newUser.pincode,
    createdAt: newUser.createdAt,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User Registered Successfully"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    throw new ApiError(400, "Phone number and password are required");
  }

  const user = await User.findOne({ phoneNumber });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  console.log("Setting user cookies: accessToken:", accessToken);

  return res
    .status(200)
    .cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to lax for cross-site compatibility
      maxAge: 1000 * 60 * 60, // 1 hour
      path: "/",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
    .json(new ApiResponse(200, { accessToken, refreshToken, userId: user._id }, "Login successful"));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Attempt to get user from token (if middleware provides it)
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
        console.log("User logged out, refresh token cleared for userId:", decoded.id);
      }
    } catch (error) {
      console.error("Token verification failed during logout:", error.message);
      // Proceed with logout even if token is invalid/expired
    }
  }

  // Always clear cookies and return success
  return res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Profile
const profile = asyncHandler(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized: Token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, {
        id: user._id,
        name: user.name,
        email: user.email,
        pincode: user.pincode,
        phoneNumber: user.phoneNumber,
      }, "Profile fetched successfully")
    );
  } catch (error) {
    console.error("Profile JWT Error:", error.message);
    if (error.name === "TokenExpiredError") {
      throw new ApiError(403, "Token expired, please log in again");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(403, "Invalid token");
    }
    throw new ApiError(403, "Token verification failed");
  }
});

const logoutAdmin = asyncHandler(async (req, res) => {
  console.log("Admin logout requested for token:", req.cookies?.adminToken);
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

module.exports = { registerUser, loginUser, logoutUser, profile, logoutAdmin };