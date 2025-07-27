const { LoanApplication } = require("../models/LoanApplication.model");
const { User } = require("../models/authentication/User.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Helper function to get user ID - now uses middleware
const getUserIdFromToken = (req) => {
  // Use the user from the auth middleware instead of manual verification
  if (req.user && req.user._id) {
    return req.user._id;
  }
  
  // Fallback: try to get from JWT cookie manually
  const token = req.cookies?.token;
  if (!token) {
    throw new ApiError(401, "Unauthorized: Token not found");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'fallback-access-token-secret');
    return decoded.id || decoded._id;
  } catch (error) {
    throw new ApiError(403, "Invalid or expired token");
  }
};

// Create new loan application
const createLoanApplication = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const formData = req.body;

  // Basic validation - only require what we actually need
  if (!formData.loanType) {
    throw new ApiError(400, "Loan type is required");
  }

  // Extract basic info from various possible field names
  const fullName = formData.fullName || formData.firstName || formData.name || 'Unknown';
  const email = formData.email || formData.email_id || '';
  const phone = formData.phone || formData.phoneNumber || formData.mobile_number || '';

  // Process co-applicants data
  const processedCoApplicants = formData.coApplicants ? formData.coApplicants.map(coApplicant => {
    const processed = {
      relationship: coApplicant.relationship || '',
      personalDetails: {
        fullName: coApplicant.personalDetails?.full_name || coApplicant.personalDetails?.fullName || '',
        email: coApplicant.personalDetails?.email_id || coApplicant.personalDetails?.email || '',
        phoneNumber: coApplicant.personalDetails?.mobile_number || coApplicant.personalDetails?.phoneNumber || '',
        dateOfBirth: coApplicant.personalDetails?.dob || coApplicant.personalDetails?.dateOfBirth || '',
        gender: coApplicant.personalDetails?.gender || '',
        maritalStatus: coApplicant.personalDetails?.marital_status || coApplicant.personalDetails?.maritalStatus || '',
        panNumber: coApplicant.personalDetails?.pan_number || coApplicant.personalDetails?.panNumber || '',
        aadharNumber: coApplicant.personalDetails?.aadhar_number || coApplicant.personalDetails?.aadharNumber || '',
        address: {
          street: coApplicant.personalDetails?.permanent_address || coApplicant.personalDetails?.address || '',
          city: coApplicant.personalDetails?.present_city || coApplicant.personalDetails?.city || '',
          state: coApplicant.personalDetails?.present_state || coApplicant.personalDetails?.state || '',
          pincode: coApplicant.personalDetails?.present_pincode || coApplicant.personalDetails?.pincode || '',
          country: 'India'
        }
      },
      employmentDetails: {
        employmentType: coApplicant.employmentDetails?.employment_type || coApplicant.employmentDetails?.employmentType || '',
        companyName: coApplicant.employmentDetails?.organisation_name || coApplicant.employmentDetails?.companyName || '',
        designation: coApplicant.employmentDetails?.designation_salaried || coApplicant.employmentDetails?.designation || '',
        workExperience: coApplicant.employmentDetails?.workExperience ? parseInt(coApplicant.employmentDetails.workExperience) : undefined,
        monthlyIncome: coApplicant.employmentDetails?.monthly_income || coApplicant.employmentDetails?.monthlyIncome ? 
          parseInt(coApplicant.employmentDetails.monthly_income || coApplicant.employmentDetails.monthlyIncome) : undefined
      },
      documents: coApplicant.documents ? Object.entries(coApplicant.documents).map(([type, doc]) => ({
        documentType: type,
        fileName: doc?.fileName || '',
        uploadedAt: doc?.uploadedAt || new Date()
      })) : []
    };
    
    return processed;
  }) : [];

  // Create comprehensive loan application with flexible field mapping
  const loanApplication = new LoanApplication({
    userId,
    loanType: formData.loanType,
    loanAmount: parseInt(formData.loanAmount || formData.loan_amount_required || 100000),
    tenure: parseInt(formData.tenure || formData.loanTenure || 12),
    purpose: formData.purpose || formData.loanPurpose || `${formData.loanType} loan application`,
    status: 'submitted',
    stage: 'verification',
    submittedAt: new Date(),
    
    // Personal Details - flexible mapping
    personalDetails: {
      fullName: fullName,
      email: email,
      phoneNumber: phone,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      gender: formData.gender || '',
      maritalStatus: formData.maritalStatus || '',
      address: {
        street: formData.currentAddress || formData.address || '',
        city: formData.currentCity || formData.city || '',
        state: formData.currentState || formData.state || '',
        pincode: formData.currentPincode || formData.pincode || '',
        country: 'India'
      },
      panNumber: formData.panNumber || '',
      aadharNumber: formData.aadharNumber || ''
    },

    // Employment Details - flexible mapping
    employmentDetails: {
      employmentType: formData.employmentType || '',
      companyName: formData.companyName || formData.businessName || '',
      designation: formData.designation || formData.profession || '',
      workExperience: formData.workExperience ? parseInt(formData.workExperience) : undefined,
      monthlyIncome: formData.monthlyIncome ? parseInt(formData.monthlyIncome) : undefined
    },

    // Co-applicants - properly structure the data
    coApplicants: processedCoApplicants,

    // Documents if provided
    documents: formData.documents ? Object.entries(formData.documents)
      .filter(([type, doc]) => doc && doc !== null) // Filter out null/undefined documents
      .map(([type, doc]) => ({
        type: 'other',
        filename: doc.fileName || doc.name || doc.filename || type || 'unknown',
        uploadedAt: new Date(),
        verified: false
      })) : [],

    // Loan Specific Details
    loanDetails: {
      // Flexible loan-specific fields
      ...formData
    }
  });

  await loanApplication.save();

  return res.status(201).json(
    new ApiResponse(201, loanApplication, "Loan application submitted successfully")
  );
});

// Get all loan applications for a user
const getUserLoanApplications = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { page = 1, limit = 10, status, loanType } = req.query;

  const query = { userId };
  if (status) query.status = status;
  if (loanType) query.loanType = loanType;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    select: '-statusHistory -comments' // Exclude heavy fields for list view
  };

  const loanApplications = await LoanApplication.find(query)
    .sort(options.sort)
    .limit(options.limit)
    .skip((options.page - 1) * options.limit)
    .lean();

  const totalApplications = await LoanApplication.countDocuments(query);

  const responseData = {
    applications: loanApplications,
    pagination: {
      currentPage: options.page,
      totalPages: Math.ceil(totalApplications / options.limit),
      totalApplications,
      hasNext: options.page < Math.ceil(totalApplications / options.limit),
      hasPrev: options.page > 1
    }
  };

  return res.status(200).json(
    new ApiResponse(200, responseData, "Loan applications fetched successfully")
  );
});

// Get single loan application details
const getLoanApplicationById = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { applicationId } = req.params;

  const loanApplication = await LoanApplication.findOne({
    $or: [
      { _id: applicationId, userId },
      { applicationId: applicationId, userId }
    ]
  }).lean();

  if (!loanApplication) {
    throw new ApiError(404, "Loan application not found");
  }

  return res.status(200).json(
    new ApiResponse(200, loanApplication, "Loan application details fetched successfully")
  );
});

// Update loan application
const updateLoanApplication = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { applicationId } = req.params;
  const updateData = req.body;

  // Don't allow updating certain protected fields
  delete updateData.userId;
  delete updateData.applicationId;
  delete updateData.statusHistory;
  delete updateData.createdAt;

  const loanApplication = await LoanApplication.findOneAndUpdate(
    {
      $or: [
        { _id: applicationId, userId },
        { applicationId: applicationId, userId }
      ]
    },
    { ...updateData, lastModifiedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!loanApplication) {
    throw new ApiError(404, "Loan application not found");
  }

  return res.status(200).json(
    new ApiResponse(200, loanApplication, "Loan application updated successfully")
  );
});

// Delete loan application (only if in draft status)
const deleteLoanApplication = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { applicationId } = req.params;

  const loanApplication = await LoanApplication.findOne({
    $or: [
      { _id: applicationId, userId },
      { applicationId: applicationId, userId }
    ]
  });

  if (!loanApplication) {
    throw new ApiError(404, "Loan application not found");
  }

  if (loanApplication.status !== 'draft') {
    throw new ApiError(400, "Only draft applications can be deleted");
  }

  await LoanApplication.findByIdAndDelete(loanApplication._id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Loan application deleted successfully")
  );
});

// Submit loan application
const submitLoanApplication = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { applicationId } = req.params;

  const loanApplication = await LoanApplication.findOne({
    $or: [
      { _id: applicationId, userId },
      { applicationId: applicationId, userId }
    ]
  });

  if (!loanApplication) {
    throw new ApiError(404, "Loan application not found");
  }

  if (loanApplication.status !== 'draft') {
    throw new ApiError(400, "Only draft applications can be submitted");
  }

  // Basic validation - ensure required fields are present
  if (!loanApplication.personalDetails?.fullName) {
    throw new ApiError(400, "Personal details are incomplete");
  }

  loanApplication.status = 'submitted';
  loanApplication.submittedAt = new Date();
  await loanApplication.save();

  return res.status(200).json(
    new ApiResponse(200, loanApplication, "Loan application submitted successfully")
  );
});

// Get user loan statistics
const getUserLoanStats = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);

  const stats = await LoanApplication.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        totalAmount: { $sum: "$loanAmount" },
        approvedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
        },
        rejectedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
        },
        pendingApplications: {
          $sum: { $cond: [{ $in: ["$status", ["draft", "submitted", "under_review"]] }, 1, 0] }
        },
        disbursedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "disbursed"] }, 1, 0] }
        }
      }
    }
  ]);

  const statusBreakdown = await LoanApplication.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$loanAmount" }
      }
    }
  ]);

  const loanTypeBreakdown = await LoanApplication.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$loanType",
        count: { $sum: 1 },
        totalAmount: { $sum: "$loanAmount" }
      }
    }
  ]);

  const recentActivity = await LoanApplication.find({ userId })
    .sort({ lastModifiedAt: -1 })
    .limit(5)
    .select('applicationId loanType loanAmount status lastModifiedAt')
    .lean();

  const responseData = {
    summary: stats[0] || {
      totalApplications: 0,
      totalAmount: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      pendingApplications: 0,
      disbursedApplications: 0
    },
    statusBreakdown,
    loanTypeBreakdown,
    recentActivity
  };

  return res.status(200).json(
    new ApiResponse(200, responseData, "User loan statistics fetched successfully")
  );
});

// Add comment to loan application
const addComment = asyncHandler(async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { applicationId } = req.params;
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, "Comment message is required");
  }

  const loanApplication = await LoanApplication.findOne({
    $or: [
      { _id: applicationId, userId },
      { applicationId: applicationId, userId }
    ]
  });

  if (!loanApplication) {
    throw new ApiError(404, "Loan application not found");
  }

  loanApplication.comments.push({
    message: message.trim(),
    addedBy: userId,
    addedAt: new Date(),
    isInternal: false
  });

  await loanApplication.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Comment added successfully")
  );
});

module.exports = {
  createLoanApplication,
  getUserLoanApplications,
  getLoanApplicationById,
  updateLoanApplication,
  deleteLoanApplication,
  submitLoanApplication,
  getUserLoanStats,
  addComment
}; 