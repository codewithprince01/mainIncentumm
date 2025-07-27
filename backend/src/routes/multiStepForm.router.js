const express = require("express");
const router = express.Router();

const {
  createApplication,
  saveStepData,
  uploadDocument,
  getApplication,
  getUserApplications,
  submitApplication,
  deleteApplication
} = require("../controllers/multiStepForm.controller");

// ====================== Multi-Step Form Routes ======================

// Create new application
router.post("/create", createApplication);

// Save step data
router.post("/save-step", saveStepData);

// Upload document
router.post("/upload-document", uploadDocument);

// Get application data by ID
router.get("/application/:applicationId", getApplication);

// Get user applications
router.get("/user/:userId", getUserApplications);

// Submit application
router.post("/submit", submitApplication);

// Delete application
router.delete("/application/:applicationId", deleteApplication);

module.exports = router; 