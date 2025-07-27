const express = require('express');
const {
  createLoanApplication,
  getUserLoanApplications,
  getLoanApplicationById,
  updateLoanApplication,
  deleteLoanApplication,
  submitLoanApplication,
  getUserLoanStats,
  addComment
} = require('../controllers/loanApplication.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Create new loan application
router.post('/create', createLoanApplication);

// Get all loan applications for user
router.get('/my-applications', getUserLoanApplications);

// Get user loan statistics
router.get('/stats', getUserLoanStats);

// Get specific loan application
router.get('/:applicationId', getLoanApplicationById);

// Update loan application
router.put('/:applicationId', updateLoanApplication);

// Delete loan application (draft only)
router.delete('/:applicationId', deleteLoanApplication);

// Submit loan application
router.post('/:applicationId/submit', submitLoanApplication);

// Add comment to loan application
router.post('/:applicationId/comment', addComment);

module.exports = router; 