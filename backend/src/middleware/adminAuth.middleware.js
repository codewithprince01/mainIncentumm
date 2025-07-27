const jwt = require("jsonwebtoken");
const Admin = require("../models/authentication/Admin.models").Admin;
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.adminToken ||
    (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

  if (!token) {
    throw new ApiError(401, "Unauthorized: Admin token not found.");
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET || "fallback-secret");
    
    // Ensure the decoded object contains a valid admin ID
    if (!decoded?.id) {
      throw new ApiError(401, "Unauthorized: Invalid admin token payload.");
    }

    // Handle default admin case
    if (decoded.id === "default-admin-id") {
      const tempAdmin = {
        _id: "default-admin-id",
        name: process.env.ADMIN_NAME || "System Administrator",
        email: process.env.ADMIN_EMAIL || "admin@incentum.com",
        role: "super_admin",
        permissions: ["read_applications", "update_applications", "manage_users", "view_statistics", "manage_admins"],
        isActive: true
      };
      req.admin = tempAdmin;
      next();
      return;
    }

    // Fetch admin by ID from database
    const admin = await Admin.findById(decoded.id).select("-password -refreshToken");
    if (!admin) {
      throw new ApiError(401, "Unauthorized: Admin not found.");
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new ApiError(403, "Forbidden: Admin account is deactivated.");
    }

    // Check if admin account is locked
    if (admin.isLocked) {
      throw new ApiError(423, "Locked: Admin account is temporarily locked.");
    }

    // Attach admin to the request object for downstream middleware/route handlers
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized: Admin token has expired.");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Unauthorized: Invalid admin token.");
    } else if (error instanceof ApiError) {
      throw error; // Re-throw ApiError instances
    } else {
      throw new ApiError(401, "Unauthorized: Admin token verification failed.");
    }
  }
});

// Middleware to check specific permissions
const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.admin) {
      throw new ApiError(401, "Unauthorized: Admin authentication required.");
    }

    if (!req.admin.permissions.includes(requiredPermission)) {
      throw new ApiError(403, `Forbidden: Missing required permission: ${requiredPermission}`);
    }

    next();
  });
};

// Middleware to check if admin has super admin role
const requireSuperAdmin = asyncHandler(async (req, res, next) => {
  if (!req.admin) {
    throw new ApiError(401, "Unauthorized: Admin authentication required.");
  }

  if (req.admin.role !== 'super_admin') {
    throw new ApiError(403, "Forbidden: Super admin privileges required.");
  }

  next();
});

module.exports = { verifyAdminJWT, checkPermission, requireSuperAdmin };