const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardStats,
  getAllUsers,
  getAllLoanApplications,
  updateLoanApplicationStatus,
  getApplicationById,
  updateApplicationById,
  downloadApplicationPDF,
  createDefaultAdmin,
  downloadDocument
} = require("../controllers/admin.controller");
const { verifyAdminJWT, checkPermission, requireSuperAdmin } = require("../middleware/adminAuth.middleware");

const router = express.Router();

// Public routes (no authentication required)
router.post("/login", loginAdmin);
router.post("/create-default", createDefaultAdmin); // Only works if no admin exists

// Protected routes (admin authentication required)
router.use(verifyAdminJWT); // All routes below require admin authentication

// Admin profile routes
router.get("/profile", getCurrentAdmin);
router.post("/logout", logoutAdmin);

// Dashboard routes
router.get("/dashboard/stats", checkPermission("view_statistics"), getDashboardStats);

// User management routes
router.get("/users", checkPermission("manage_users"), getAllUsers);

// Loan application management routes
router.get("/applications", checkPermission("read_applications"), getAllLoanApplications);
router.get("/applications/:applicationId", checkPermission("read_applications"), getApplicationById);
router.patch("/applications/:applicationId/status", checkPermission("update_applications"), updateLoanApplicationStatus);
router.put("/applications/:applicationId", checkPermission("update_applications"), updateApplicationById);
router.get("/applications/:applicationId/download", checkPermission("read_applications"), downloadApplicationPDF);

// Download individual document
router.get("/applications/:applicationId/documents/:documentType/:applicantIndex", checkPermission("read_applications"), downloadDocument);

// Admin management routes (super admin only)
router.post("/register", requireSuperAdmin, registerAdmin);

module.exports = router; 