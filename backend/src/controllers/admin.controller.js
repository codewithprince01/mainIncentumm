const { Admin } = require("../models/authentication/Admin.models");
const { User } = require("../models/authentication/User.models");
const { LoanApplication } = require("../models/LoanApplication.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Admin Registration (Only for creating initial admin or by super admin)
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'admin' } = req.body;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new ApiError(400, "Admin with this email already exists");
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
    role,
    createdBy: req.admin?._id, // If created by another admin
  });

  // Remove password from response
  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

  res.status(201).json(
    new ApiResponse(201, createdAdmin, "Admin registered successfully")
  );
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Check for default admin credentials
  const defaultEmail = process.env.ADMIN_EMAIL || "admin@incentum.com";
  const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email === defaultEmail && password === defaultPassword) {
    // Create a temporary admin object for default admin
    const tempAdmin = {
      _id: "default-admin-id",
      name: process.env.ADMIN_NAME || "System Administrator",
      email: defaultEmail,
      role: "super_admin",
      permissions: ["read_applications", "update_applications", "manage_users", "view_statistics", "manage_admins"],
      isActive: true
    };

    // Generate token with admin ID
    const accessToken = jwt.sign(
      { id: tempAdmin._id, email: tempAdmin.email },
      process.env.ADMIN_ACCESS_TOKEN_SECRET || "fallback-secret",
      { expiresIn: "8h" }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    };

    res
      .status(200)
      .cookie("adminToken", accessToken, options)
      .json(
        new ApiResponse(200, {
          admin: tempAdmin,
          accessToken,
        }, "Admin logged in successfully")
      );
    return;
  }

  // Find admin by email in database
  const admin = await Admin.findOne({ email, isActive: true });
  if (!admin) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if account is locked
  if (admin.isLocked) {
    throw new ApiError(423, "Account is temporarily locked due to too many failed login attempts");
  }

  // Check password
  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    await admin.incLoginAttempts();
    throw new ApiError(401, "Invalid credentials");
  }

  // Reset login attempts on successful login
  await admin.resetLoginAttempts();

  // Generate tokens
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  // Save refresh token to database
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  // Remove password and refresh token from response
  const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  };

  res
    .status(200)
    .cookie("adminToken", accessToken, options)
    .json(
      new ApiResponse(200, {
        admin: loggedInAdmin,
        accessToken,
      }, "Admin logged in successfully")
    );
});

// Admin Logout
const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(200)
    .clearCookie("adminToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

// Get Current Admin Profile
const getCurrentAdmin = asyncHandler(async (req, res) => {
  // Handle default admin case
  if (req.admin._id === "default-admin-id") {
    res.status(200).json(
      new ApiResponse(200, req.admin, "Admin profile retrieved successfully")
    );
    return;
  }

  const admin = await Admin.findById(req.admin._id).select("-password -refreshToken");
  
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  res.status(200).json(
    new ApiResponse(200, admin, "Admin profile retrieved successfully")
  );
});

// Dashboard Statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalApplications = await LoanApplication.countDocuments();
    const totalAdmins = await Admin.countDocuments({ isActive: true });

    // Get application statistics
    const applicationStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get loan type statistics
    const loanTypeStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: "$loanType",
          count: { $sum: 1 },
          totalAmount: { $sum: "$loanAmount" }
        }
      }
    ]);

    // Get recent applications
    const recentApplications = await LoanApplication.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('applicationId loanType loanAmount status createdAt userId');

    // Get monthly statistics
    const monthlyStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          applications: { $sum: 1 },
          totalAmount: { $sum: "$loanAmount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    // Get user registration statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalApplications,
        totalAdmins,
        pendingApplications: applicationStats.find(s => s._id === 'submitted')?.count || 0,
        approvedApplications: applicationStats.find(s => s._id === 'approved')?.count || 0,
        rejectedApplications: applicationStats.find(s => s._id === 'rejected')?.count || 0,
      },
      applicationsByStatus: applicationStats,
      loanTypeStats,
      recentApplications,
      monthlyStats,
      userStats
    };

    res.status(200).json(
      new ApiResponse(200, stats, "Dashboard statistics retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new ApiError(500, "Failed to fetch dashboard statistics");
  }
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select("-password -refreshToken")
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalUsers = await User.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalUsers
    }, "Users retrieved successfully")
  );
});

// Get All Loan Applications
const getAllLoanApplications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || '';
  const loanType = req.query.loanType || '';
  const search = req.query.search || '';
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

  // First try LoanApplication model
  const loanQuery = {};
  if (status) loanQuery.status = status;
  if (loanType) loanQuery.loanType = loanType;
  if (search) {
    loanQuery.$or = [
      { applicationId: { $regex: search, $options: 'i' } },
      { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
      { 'personalDetails.email': { $regex: search, $options: 'i' } }
    ];
  }

  const loanApplications = await LoanApplication.find(loanQuery)
    .populate('userId', 'name email phoneNumber')
    .sort({ [sortBy]: sortOrder })
    .lean();

  // Then try Form model
  const formQuery = {};
  if (status) formQuery.status = status;
  if (loanType) formQuery['loanApplication.loanType'] = loanType;
  if (search) {
    formQuery.$or = [
      { 'personalDetails.full_name': { $regex: search, $options: 'i' } },
      { 'personalDetails.email_id': { $regex: search, $options: 'i' } }
    ];
  }

  const formApplications = await Form.find(formQuery)
    .populate('user', 'name email phoneNumber')
    .sort({ [sortBy]: sortOrder })
    .lean();

  // Combine and normalize the results
  const allApplications = [
    ...loanApplications.map(app => ({
      ...app,
      applicationId: app.applicationId || app._id,
      loanType: app.loanType,
      loanAmount: app.loanAmount,
      userId: app.userId
    })),
    ...formApplications.map(form => ({
      ...form,
      applicationId: form._id,
      loanType: form.loanApplication?.loanType || 'N/A',
      loanAmount: form.loanApplication?.loan_amount_required || 0,
      userId: form.user
    }))
  ];

  // Sort combined results
  allApplications.sort((a, b) => {
    if (sortOrder === 1) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedApplications = allApplications.slice(startIndex, endIndex);

  res.status(200).json(
    new ApiResponse(200, {
      applications: paginatedApplications,
      totalPages: Math.ceil(allApplications.length / limit),
      currentPage: page,
      totalApplications: allApplications.length
    }, "Loan applications retrieved successfully")
  );
});

// Update Loan Application Status
const updateLoanApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, comments, approvedAmount } = req.body;

  if (!['submitted', 'under_review', 'approved', 'rejected', 'disbursed'].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const application = await LoanApplication.findById(applicationId);
  if (!application) {
    throw new ApiError(404, "Loan application not found");
  }

  // Update status
  application.status = status;
  application.lastModified = new Date();

  // If status is approved and approvedAmount is provided, set it
  if (status === 'approved' && approvedAmount !== undefined) {
    if (approvedAmount < 0) {
      throw new ApiError(400, "Approved amount cannot be negative");
    }
    if (approvedAmount > application.loanAmount) {
      throw new ApiError(400, "Approved amount cannot exceed requested amount");
    }
    application.approvedAmount = approvedAmount;
  }

  // Add status history
  application.statusHistory.push({
    status,
    date: new Date(),
    updatedBy: req.admin._id,
    comments
  });

  // Add comment if provided
  if (comments) {
    application.comments.push({
      comment: comments,
      commentBy: req.admin._id,
      commentDate: new Date()
    });
  }

  await application.save();

  res.status(200).json(
    new ApiResponse(200, application, "Loan application status updated successfully")
  );
});

// Get Single Application by ID
const getApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  // Try to find in both LoanApplication and Form models
  let application = await LoanApplication.findById(applicationId)
    .populate('userId', 'name email phoneNumber');

  if (!application) {
    // Try to find in Form model
    application = await Form.findById(applicationId)
      .populate('user', 'name email phoneNumber');
  }

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  res.status(200).json(
    new ApiResponse(200, application, "Application details retrieved successfully")
  );
});

// Update Application by ID
const updateApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const updateData = req.body;

  // Remove fields that shouldn't be updated
  delete updateData.userId;
  delete updateData.user;
  delete updateData.applicationId;
  delete updateData.createdAt;
  delete updateData._id;

  // Try to find and update in LoanApplication model first
  let application = await LoanApplication.findById(applicationId);
  
  if (application) {
    // Update LoanApplication
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        application[key] = updateData[key];
      }
    });
    
    application.lastModifiedAt = new Date();
    await application.save();
    
    // Add to status history
    application.statusHistory.push({
      status: application.status,
      date: new Date(),
      updatedBy: req.admin._id,
      comments: 'Updated by admin'
    });
    
    await application.save();
  } else {
    // Try Form model
    application = await Form.findById(applicationId);
    if (!application) {
      throw new ApiError(404, "Application not found");
    }
    
    // Update Form
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        application[key] = updateData[key];
      }
    });
    
    await application.save();
  }

  res.status(200).json(
    new ApiResponse(200, application, "Application updated successfully")
  );
});

// Download Application as PDF
const downloadApplicationPDF = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  // Try to find in both models
  let application = await LoanApplication.findById(applicationId)
    .populate('userId', 'name email phoneNumber');

  if (!application) {
    application = await Form.findById(applicationId)
      .populate('user', 'name email phoneNumber');
  }

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  // Create PDF with professional styling
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    info: {
      Title: `Loan Application - ${application.applicationId || application._id}`,
      Author: 'Incentum Financial Services',
      Subject: 'Loan Application Details',
      Keywords: 'loan, application, finance'
    }
  });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="application-${application.applicationId || application._id}.pdf"`);
  
  // Pipe PDF to response
  doc.pipe(res);

  // Define colors
  const primaryColor = '#2563eb'; // Blue
  const secondaryColor = '#64748b'; // Gray
  const accentColor = '#10b981'; // Green
  const textColor = '#1f2937'; // Dark gray

  // Helper function to add a section header
  const addSectionHeader = (title, color = primaryColor) => {
    doc.fontSize(14)
       .fillColor(color)
       .text(title, { underline: true })
       .fillColor(textColor)
       .moveDown(0.5);
  };

  // Helper function to add a field
  const addField = (label, value, indent = 0) => {
    if (value && value !== 'N/A' && value !== '') {
      doc.fontSize(10)
         .fillColor(secondaryColor)
         .text(`${' '.repeat(indent)}${label}:`, { continued: true })
         .fillColor(textColor)
         .text(` ${value}`)
         .moveDown(0.3);
    }
  };

  // Header with company logo area and title
  doc.rect(0, 0, doc.page.width, 80).fill('#f8fafc');
  doc.fillColor(primaryColor)
     .fontSize(24)
     .text('INCENTUM FINANCIAL SERVICES', 50, 25, { align: 'center' });
  
  doc.fillColor(secondaryColor)
     .fontSize(12)
     .text('Professional Loan Application Report', 50, 50, { align: 'center' });

  // Add a subtle border
  doc.rect(50, 90, doc.page.width - 100, 2).fill(primaryColor);
  
  doc.y = 110;

  // Status badge
  const statusColors = {
    'approved': accentColor,
    'rejected': '#ef4444',
    'under_review': '#f59e0b',
    'disbursed': '#8b5cf6',
    'submitted': primaryColor
  };
  
  const statusColor = statusColors[application.status] || primaryColor;
  doc.rect(50, doc.y, 150, 25).fill(statusColor);
  doc.fillColor('white')
     .fontSize(12)
     .text(application.status?.toUpperCase() || 'PENDING', 55, doc.y + 8);
  
  doc.y += 40;
  doc.fillColor(textColor);

  // Application Overview Box
  doc.rect(50, doc.y, doc.page.width - 100, 80).stroke(primaryColor);
  doc.y += 10;
  
  addSectionHeader('APPLICATION OVERVIEW');
  
  const leftColumn = 50 + 20;
  const rightColumn = (doc.page.width / 2) + 20;
  const currentY = doc.y;
  
  // Left column
  doc.y = currentY;
  doc.x = leftColumn;
  addField('Application ID', application.applicationId || application._id);
  addField('Loan Type', application.loanType?.toUpperCase());
  addField('Requested Amount', application.loanAmount ? `₹${application.loanAmount.toLocaleString()}` : 'N/A');
  
  // Right column
  doc.y = currentY;
  doc.x = rightColumn;
  addField('Submitted Date', new Date(application.createdAt).toLocaleDateString('en-IN'));
  addField('Tenure', application.tenure ? `${application.tenure} months` : 'N/A');
  if (application.approvedAmount) {
    addField('Approved Amount', `₹${application.approvedAmount.toLocaleString()}`, 0);
  }
  
  doc.y += 20;
  doc.x = 50;

  // Applicant Information
  const user = application.userId || application.user;
  if (user) {
    addSectionHeader('APPLICANT INFORMATION');
    
    const personalY = doc.y;
    doc.y = personalY;
    doc.x = leftColumn;
    addField('Full Name', user.name);
    addField('Email Address', user.email);
    
    doc.y = personalY;
    doc.x = rightColumn;
    addField('Phone Number', user.phoneNumber);
    if (application.personalDetails?.dateOfBirth) {
      addField('Date of Birth', new Date(application.personalDetails.dateOfBirth).toLocaleDateString('en-IN'));
    }
    
    doc.y += 20;
    doc.x = 50;
  }

  // Personal Details
  if (application.personalDetails) {
    addSectionHeader('PERSONAL DETAILS');
    
    const personalY = doc.y;
    doc.y = personalY;
    doc.x = leftColumn;
    
    if (application.personalDetails.gender) {
      addField('Gender', application.personalDetails.gender.charAt(0).toUpperCase() + application.personalDetails.gender.slice(1));
    }
    if (application.personalDetails.maritalStatus) {
      addField('Marital Status', application.personalDetails.maritalStatus.charAt(0).toUpperCase() + application.personalDetails.maritalStatus.slice(1));
    }
    
    doc.y = personalY;
    doc.x = rightColumn;
    
    if (application.personalDetails.alternatePhone) {
      addField('Alternate Phone', application.personalDetails.alternatePhone);
    }
    if (application.personalDetails.panNumber) {
      addField('PAN Number', application.personalDetails.panNumber);
    }
    
    // Address
    if (application.personalDetails.address) {
      doc.y += 20;
      doc.x = 50;
      addField('Address', [
        application.personalDetails.address.street,
        application.personalDetails.address.city,
        application.personalDetails.address.state,
        application.personalDetails.address.pincode,
        application.personalDetails.address.country
      ].filter(Boolean).join(', '));
    }
    
    doc.y += 20;
    doc.x = 50;
  }

  // Employment Details
  if (application.employmentDetails) {
    addSectionHeader('EMPLOYMENT INFORMATION');
    
    const empY = doc.y;
    doc.y = empY;
    doc.x = leftColumn;
    
    if (application.employmentDetails.employmentType) {
      addField('Employment Type', application.employmentDetails.employmentType.replace('_', ' ').toUpperCase());
    }
    if (application.employmentDetails.companyName) {
      addField('Company Name', application.employmentDetails.companyName);
    }
    if (application.employmentDetails.designation) {
      addField('Designation', application.employmentDetails.designation);
    }
    
    doc.y = empY;
    doc.x = rightColumn;
    
    if (application.employmentDetails.workExperience) {
      addField('Work Experience', `${application.employmentDetails.workExperience} years`);
    }
    if (application.employmentDetails.monthlyIncome) {
      addField('Monthly Income', `₹${application.employmentDetails.monthlyIncome.toLocaleString()}`);
    }
    
    doc.y += 20;
    doc.x = 50;
  }

  // Loan Details
  if (application.purpose) {
    addSectionHeader('LOAN PURPOSE');
    addField('Purpose', application.purpose);
    doc.y += 10;
  }

  // Documents
  if (application.documents && application.documents.length > 0) {
    addSectionHeader('DOCUMENTS SUBMITTED');
    
    application.documents.forEach((doc_item, index) => {
      addField(`Document ${index + 1}`, `${doc_item.type} - ${doc_item.filename}`);
    });
    
    doc.y += 10;
  }

  // Status History
  if (application.statusHistory && application.statusHistory.length > 0) {
    addSectionHeader('STATUS HISTORY', '#6b7280');
    
    application.statusHistory.forEach((history) => {
      const date = new Date(history.date || history.updatedAt).toLocaleDateString('en-IN');
      const status = history.status.toUpperCase();
      const comments = history.comments ? ` - ${history.comments}` : '';
      addField(date, `${status}${comments}`);
    });
    
    doc.y += 10;
  }

  // Footer
  doc.y = doc.page.height - 100;
  doc.rect(50, doc.y, doc.page.width - 100, 2).fill(primaryColor);
  doc.y += 10;
  
  doc.fontSize(8)
     .fillColor(secondaryColor)
     .text('This is a computer-generated document from Incentum Financial Services.', 50, doc.y, { align: 'center' });
  
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, 50, doc.y + 15, { align: 'center' });
  
  doc.text('For queries, contact: support@incentum.com | +91-1234567890', 50, doc.y + 30, { align: 'center' });

  // Finalize PDF
  doc.end();
});

// Create Default Admin (for initial setup)
const createDefaultAdmin = asyncHandler(async (req, res) => {
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    throw new ApiError(400, "Default admin already exists");
  }

  const admin = await Admin.create({
    name: process.env.ADMIN_NAME || "System Administrator",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'super_admin',
    permissions: ['read_applications', 'update_applications', 'manage_users', 'view_statistics', 'manage_admins']
  });

  const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

  res.status(201).json(
    new ApiResponse(201, createdAdmin, "Default admin created successfully")
  );
});

// Download Individual Document
const downloadDocument = asyncHandler(async (req, res) => {
  const { applicationId, documentType, applicantIndex } = req.params;
  
  try {
    console.log(`Downloading document: applicationId=${applicationId}, documentType=${documentType}, applicantIndex=${applicantIndex}`);
    
    // Try to find in both models
    let application = await LoanApplication.findById(applicationId);
    let form = null;
    
    if (!application) {
      form = await Form.findById(applicationId);
    }
    
    if (!application && !form) {
      throw new ApiError(404, "Application not found");
    }
    
    let documentPath = null;
    const applicantIdx = parseInt(applicantIndex) || 0;
    
    // Handle Form model documents (supports multiple applicants)
    if (form && form.loanDocuments && form.loanDocuments.length > 0) {
      console.log(`Form model found with ${form.loanDocuments.length} document sets`);
      if (applicantIdx < form.loanDocuments.length) {
        const applicantDocs = form.loanDocuments[applicantIdx];
        documentPath = applicantDocs[documentType];
        console.log(`Document path for applicant ${applicantIdx}: ${documentPath}`);
      }
    } 
    // Handle LoanApplication model documents
    else if (application) {
      console.log(`LoanApplication model found`);
      
      if (applicantIdx === 0 && application.documents && application.documents.length > 0) {
        // Main applicant documents
        const doc = application.documents.find(d => d.type === documentType);
        if (doc) {
          documentPath = doc.filename;
          console.log(`Main applicant document found: ${documentPath}`);
        }
      } else if (applicantIdx > 0 && application.coApplicants && application.coApplicants.length > (applicantIdx - 1)) {
        // Co-applicant documents (applicantIndex is 1-based for co-applicants)
        const coApplicant = application.coApplicants[applicantIdx - 1];
        if (coApplicant.documents && coApplicant.documents.length > 0) {
          const doc = coApplicant.documents.find(d => d.documentType === documentType);
          if (doc) {
            documentPath = doc.fileName;
            console.log(`Co-applicant ${applicantIdx - 1} document found: ${documentPath}`);
          }
        }
      }
    }
    
    if (!documentPath) {
      console.log(`Document not found: ${documentType} for applicant ${applicantIdx}`);
      throw new ApiError(404, "Document not found");
    }
    
    // Construct full file path
    const fs = require('fs');
    const path = require('path');
    
    // Remove any leading slash and ensure proper path
    const cleanPath = documentPath.replace(/^\/+/, '');
    const fullPath = path.join(process.cwd(), cleanPath);
    
    console.log(`Attempting to access file: ${fullPath}`);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found on disk: ${fullPath}`);
      throw new ApiError(404, "Document file not found on server");
    }
    
    // Get file stats
    const stats = fs.statSync(fullPath);
    const fileExtension = path.extname(fullPath).toLowerCase();
    
    // Set appropriate content type
    let contentType = 'application/octet-stream';
    if (fileExtension === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.jpg', '.jpeg'].includes(fileExtension)) {
      contentType = 'image/jpeg';
    } else if (fileExtension === '.png') {
      contentType = 'image/png';
    } else if (['.doc', '.docx'].includes(fileExtension)) {
      contentType = 'application/msword';
    }
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${documentType}-applicant-${applicantIdx + 1}-${path.basename(fullPath)}"`);
    
    console.log(`Streaming file: ${fullPath} (${stats.size} bytes)`);
    
    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading document:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to download document");
  }
});

module.exports = {
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
}; 