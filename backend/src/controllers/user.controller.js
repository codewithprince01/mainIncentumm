const { User } = require("../models/authentication/User.models"); // Mongoose model
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// Load environment variables
require('dotenv').config();
const ADMIN_CREDENTIALS = process.env.ADMIN_CREDENTIALS 
  ? JSON.parse(process.env.ADMIN_CREDENTIALS)
  : [{ phoneNumber: "9876543210", password: "admin123" }]; // Default admin credentials

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
  const { firstName, lastName, name, email, phoneNumber, pincode, password, confirmPassword, confirmpassword } = req.body;

  // Support both formats: firstName/lastName or name
  const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
  const confirmPass = confirmPassword || confirmpassword;

  if (!fullName || !email || !phoneNumber || !pincode || !password || !confirmPass) {
    throw new ApiError(400, "All fields are required");
  }

  if (password !== confirmPass) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists! Please login.");
  }

  const newUser = new User({ name: fullName, email, phoneNumber, pincode, password });
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

  // Prepare user data for response (excluding sensitive fields)
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    pincode: user.pincode,
    createdAt: user.createdAt
  };

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
    .json(new ApiResponse(200, { 
      accessToken, 
      refreshToken, 
      userId: user._id,
      user: userData
    }, "Login successful"));
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Attempt to get user from token (if middleware provides it)
  const token = req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback-access-token-secret');
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
  // The verifyJWT middleware already provides req.user
  const user = req.user;
  
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
});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
  // The verifyJWT middleware already provides req.user
  const user = req.user;
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { name, email, phoneNumber, pincode } = req.body;

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }
  }

  // Update user fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (pincode) user.pincode = pincode;

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pincode: updatedUser.pincode,
      phoneNumber: updatedUser.phoneNumber,
    }, "Profile updated successfully")
  );
});

// Login admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    throw new ApiError(400, "Phone number and password are required");
  }

  const admin = ADMIN_CREDENTIALS.find(
    (cred) => cred.phoneNumber === phoneNumber && cred.password === password
  );

  if (!admin) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const adminToken = jwt.sign(
    { phoneNumber: admin.phoneNumber },
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  console.log("Setting adminToken cookie:", adminToken);

  return res
    .status(200)
    .cookie("adminToken", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to lax for cross-site compatibility
      maxAge: 1000 * 60 * 60, // 1 hour
      path: "/",
    })
    .json(new ApiResponse(200, { adminToken }, "Admin login successful"));
});

// Verify admin
const verifyAdmin = asyncHandler(async (req, res) => {
  const token = req.cookies?.adminToken;

  console.log("Verifying adminToken from cookies:", token);

  if (!token) {
    throw new ApiError(401, "Unauthorized: No admin token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    const admin = ADMIN_CREDENTIALS.find(
      (cred) => cred.phoneNumber === decoded.phoneNumber
    );
    if (!admin) {
      throw new ApiError(403, "Forbidden: Not an authorized admin.");
    }
    return res.status(200).json(new ApiResponse(200, {}, "Admin token verified"));
  } catch (error) {
    console.error("Verify admin error:", error.message);
    throw new ApiError(401, "Unauthorized: Invalid or expired admin token.");
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  profile,
  updateProfile,
  loginAdmin,
  verifyAdmin,
  logoutAdmin,
};