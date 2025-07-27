const { Router } = require("express");
const { registerUser, loginUser, logoutUser, profile, updateProfile, loginAdmin, verifyAdmin, logoutAdmin } = require("../controllers/user.controller");
const { verifyAdminJWT } = require("../middleware/adminAuth.middleware");
const csurf = require("csurf");

// Assuming verifyJWT exists or will be created
const { verifyJWT } = require("../middleware/auth.middleware"); // Add this line

const router = Router();
const csrfProtection = csurf({ cookie: true });

// User routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser); // Remove verifyJWT to allow logout with invalid tokens
router.route("/profile").get(verifyJWT, profile).put(verifyJWT, updateProfile); // Add PUT for profile update

// Admin routes
router.route("/admin-login").post(loginAdmin);
router.route("/verify-admin").get(verifyAdminJWT, verifyAdmin);
router.route("/admin-logout").post(verifyAdminJWT, csrfProtection, logoutAdmin);

module.exports = router;