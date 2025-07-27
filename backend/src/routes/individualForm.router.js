const { Router } = require("express");
const {
  savePersonalDetails,
  saveLoanApplication,
  handleFileUploads,
  saveLoanDocuments,
  fetchAllForms,
  fetchFormById,
  updateForm,
  updateFormStatus,
  deleteForm,
  getFormsByUserId,
} = require("../controllers/individualForm.controller.js");
const { verifyAdminJWT } = require("../middleware/adminAuth.middleware");
const csurf = require("csurf");

const router = Router();
const csrfProtection = csurf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  secret: process.env.CSRF_SECRET,
});

// User routes (no CSRF or admin restriction)
router.route("/personal-details").post(savePersonalDetails);
router.route("/loan-application").post(saveLoanApplication);
router.route("/loan-documents").post(handleFileUploads, saveLoanDocuments);
router.route("/user/:userId").get(getFormsByUserId); // No verifyAdminJWT here

// Admin routes
router.route("/").get(verifyAdminJWT, fetchAllForms);
router.route("/:id").get(verifyAdminJWT, fetchFormById);
router.route("/:id").put(verifyAdminJWT, csrfProtection, updateForm);
router.route("/:id/status").patch(verifyAdminJWT, csrfProtection, updateFormStatus);
router.route("/:id").delete(verifyAdminJWT, csrfProtection, deleteForm);

module.exports = router;