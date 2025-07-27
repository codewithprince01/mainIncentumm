const jwt = require("jsonwebtoken");
const { User } = require("../models/authentication/User.models"); // Mongoose model
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token =
    req.cookies?.token || 
    (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

  if (!token) {
    throw new ApiError(401, "Unauthorized: Token not found.");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Ensure the decoded object contains a valid user ID
    if (!decoded?.id) {
      throw new ApiError(401, "Unauthorized: Invalid token payload.");
    }

    // Fetch user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found.");
    }

    // Attach user to the request object for downstream middleware/route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized: Token has expired.");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Unauthorized: Invalid token.");
    } else {
      throw new ApiError(401, "Unauthorized: Token verification failed.");
    }
  }
});

module.exports = { verifyJWT };
