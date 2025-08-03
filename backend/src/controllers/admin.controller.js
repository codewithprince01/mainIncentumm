const { Admin } = require("../models/authentication/Admin.models");
const { User } = require("../models/authentication/User.models");
const { LoanApplication } = require("../models/LoanApplication.model");
const Form = require("../models/individualForms/FormOne.model");
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

  console.log('🔍 Admin - Found loan applications:', loanApplications.length);
  if (loanApplications.length > 0) {
    console.log('🔍 Admin - First application structure:', {
      id: loanApplications[0]._id,
      hasPersonalDetails: !!loanApplications[0].personalDetails,
      personalDetailsKeys: loanApplications[0].personalDetails ? Object.keys(loanApplications[0].personalDetails) : 'none',
      hasEmploymentDetails: !!loanApplications[0].employmentDetails,
      employmentDetailsKeys: loanApplications[0].employmentDetails ? Object.keys(loanApplications[0].employmentDetails) : 'none',
      hasLoanSpecificDetails: !!loanApplications[0].loanSpecificDetails,
      loanSpecificDetailsKeys: loanApplications[0].loanSpecificDetails ? Object.keys(loanApplications[0].loanSpecificDetails) : 'none'
    });
  }

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
      loanAmount: app.loanSpecificDetails?.loanAmountRequired || 0,
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

// Get Single Application by ID
const getApplicationById = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  console.log('🔍 Admin - Fetching application by ID:', applicationId);

  // Try to find in both LoanApplication and Form models
  let application = await LoanApplication.findById(applicationId)
    .populate('userId', 'name email phoneNumber');

  if (application) {
    console.log('🔍 Admin - Found application in LoanApplication model:', {
      id: application._id,
      loanType: application.loanType,
      status: application.status,
      hasPersonalDetails: !!application.personalDetails,
      personalDetailsKeys: application.personalDetails ? Object.keys(application.personalDetails) : 'none',
      personalDetailsData: application.personalDetails,
      hasEmploymentDetails: !!application.employmentDetails,
      employmentDetailsKeys: application.employmentDetails ? Object.keys(application.employmentDetails) : 'none',
      employmentDetailsData: application.employmentDetails,
      hasLoanSpecificDetails: !!application.loanSpecificDetails,
      loanSpecificDetailsKeys: application.loanSpecificDetails ? Object.keys(application.loanSpecificDetails) : 'none',
      loanSpecificDetailsData: application.loanSpecificDetails
    });
  }

  if (!application) {
    console.log('🔍 Admin - Not found in LoanApplication, trying Form model');
    // Try to find in Form model
    application = await Form.findById(applicationId)
      .populate('user', 'name email phoneNumber');
      
    if (application) {
      console.log('🔍 Admin - Found application in Form model');
    }
  }

  if (!application) {
    console.log('❌ Admin - Application not found in either model');
    throw new ApiError(404, "Application not found");
  }

  console.log('✅ Admin - Sending application response');
  res.status(200).json(
    new ApiResponse(200, application, "Application details retrieved successfully")
  );
});

// Serve Document File
const serveDocument = asyncHandler(async (req, res) => {
  const { applicationId, documentId } = req.params;
  try {
    console.log(`Serving document: applicationId=${applicationId}, documentId=${documentId}`);
    let application = await LoanApplication.findById(applicationId);
    let form = null;
    if (!application) {
      form = await Form.findById(applicationId);
    }
    if (!application && !form) {
      throw new ApiError(404, "Application not found");
    }
    let documentPath = null;
    let documentName = null;
    let foundDoc = null;

    // 1. Search in LoanApplication model's main documents
    if (application && application.documents && application.documents.length > 0) {
      foundDoc = application.documents.find(d => d._id.toString() === documentId);
      if (foundDoc) {
        documentPath = foundDoc.filePath || foundDoc.path;
        documentName = foundDoc.fileName || foundDoc.filename || foundDoc.originalname;
        console.log(`Found document in LoanApplication.documents: ${documentPath}`);
      }
    }
    
    // 2. If not found, search in Form model's loanDocuments
    if (!foundDoc && form && form.loanDocuments && form.loanDocuments.length > 0) {
      foundDoc = form.loanDocuments.find(d => d._id.toString() === documentId);
      if (foundDoc) {
        documentPath = foundDoc.filePath || foundDoc.path;
        documentName = foundDoc.fileName || foundDoc.filename || foundDoc.originalname;
        console.log(`Found document in Form.loanDocuments: ${documentPath}`);
      }
    }

    // 3. If not found, search within coApplicants documents (for LoanApplication model)
    if (!foundDoc && application && application.coApplicants && application.coApplicants.length > 0) {
        for (const coApplicant of application.coApplicants) {
            if (coApplicant.documents && coApplicant.documents.length > 0) {
                foundDoc = coApplicant.documents.find(d => d._id.toString() === documentId);
                if (foundDoc) {
                    documentPath = foundDoc.filePath || foundDoc.path;
                    documentName = foundDoc.fileName || foundDoc.filename || foundDoc.originalname;
                    console.log(`Found document in coApplicant.documents: ${documentPath}`);
                    break;
                }
            }
        }
    }
    
    if (!documentPath) {
      console.log(`Document not found by ID: ${documentId} for application ${applicationId}`);
      throw new ApiError(404, "Document not found");
    }
    
    const fs = require('fs');
    const path = require('path');
    const cleanPath = documentPath.replace(/^\/+/, '');
    const fullPath = path.join(process.cwd(), cleanPath);
    
    console.log(`Attempting to access file: ${fullPath}`);
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found on disk: ${fullPath}`);
      throw new ApiError(404, "Document file not found on server");
    }
    
    const stats = fs.statSync(fullPath);
    const fileExtension = path.extname(fullPath).toLowerCase();
    
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
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${documentName || path.basename(fullPath)}"`);
    
    console.log(`Streaming file: ${fullPath} (${stats.size} bytes)`);
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error serving document:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Failed to serve document");
  }
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

  // Create PDF with professional styling and indigo theme
  const doc = new PDFDocument({ 
    margin: 40,
    size: 'A4',
    info: {
      Title: `Loan Application - ${application.applicationId || application._id}`,
      Author: 'Incentum Financial Services',
      Subject: 'Official Loan Application Report',
      Keywords: 'loan, application, finance, official, incentum'
    }
  });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Official-Application-${application.applicationId || application._id}.pdf"`);
  
  // Pipe PDF to response
  doc.pipe(res);

  // Define professional indigo color scheme
  const primaryColor = '#312e81'; // Indigo-950
  const secondaryColor = '#6366f1'; // Indigo-500
  const accentColor = '#4f46e5'; // Indigo-600
  const lightColor = '#e0e7ff'; // Indigo-100
  const textColor = '#1e1b4b'; // Indigo-950
  const mutedColor = '#64748b'; // Slate-500

  // Helper function to add professional header
  const addPageHeader = () => {
    // Gradient background for header
    const gradient = doc.linearGradient(0, 0, doc.page.width, 70);
    gradient.stop(0, primaryColor).stop(1, secondaryColor);
    doc.rect(0, 0, doc.page.width, 70).fill(gradient);
    
    // Company name with elegant styling
    doc.fillColor('white')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('INCENTUM', 40, 15);
    
    doc.fontSize(16)
       .font('Helvetica')
       .text('FINANCIAL SERVICES', 40, 45);
    
    // Official seal area (decorative circle)
    doc.circle(doc.page.width - 80, 35, 25).stroke('white');
    doc.fontSize(8).text('OFFICIAL', doc.page.width - 95, 30, { align: 'center', width: 30 });
    doc.text('REPORT', doc.page.width - 95, 40, { align: 'center', width: 30 });
    
    doc.y = 90;
  };

  // Helper function to add section with indigo styling
  const addSectionHeader = (title, icon = '■') => {
    if (doc.y > 720) {
      doc.addPage();
      addPageHeader();
    }
    
    doc.rect(40, doc.y, doc.page.width - 80, 30).fill(lightColor);
    doc.fillColor(primaryColor)
       .fontSize(14)
       .font('Helvetica-Bold')
       .text(`${icon} ${title}`, 50, doc.y + 8);
    
    doc.y += 40;
    doc.fillColor(textColor);
  };

  // Helper function to add field with better formatting
  const addField = (label, value, options = {}) => {
    if (!value || value === 'N/A' || value === '') return;
    
    const { isHighlight = false, isCurrency = false } = options;
    
    if (doc.y > 750) {
      doc.addPage();
      addPageHeader();
    }
    
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor(mutedColor)
       .text(`${label}:`, 50, doc.y, { width: 150 });
    
    let displayValue = value;
    if (isCurrency && typeof value === 'number') {
      displayValue = `₹${value.toLocaleString('en-IN')}`;
    }
    
    doc.font('Helvetica')
       .fillColor(isHighlight ? secondaryColor : textColor)
       .text(displayValue, 220, doc.y, { width: 320 });
    
    doc.y += 18;
  };

  // Start first page
  addPageHeader();

  // Application status badge
  const statusColors = {
    'approved': '#10b981',
    'rejected': '#ef4444', 
    'under_review': '#f59e0b',
    'disbursed': '#8b5cf6',
    'submitted': secondaryColor,
    'pending': mutedColor
  };
  
  const statusColor = statusColors[application.status?.toLowerCase()] || mutedColor;
  doc.roundedRect(40, doc.y, 200, 35, 5).fill(statusColor);
  doc.fillColor('white')
     .fontSize(16)
     .font('Helvetica-Bold')
     .text(`STATUS: ${(application.status || 'PENDING').toUpperCase()}`, 50, doc.y + 10);
  
  doc.y += 50;

  // Application Overview with enhanced styling
  addSectionHeader('APPLICATION OVERVIEW', '📋');
  
  const overviewLeft = [
    ['Application ID', application.applicationId || application._id, { isHighlight: true }],
    ['Application Type', (application.loanType || 'N/A').toUpperCase(), { isHighlight: true }],
    ['Submitted Date', new Date(application.createdAt).toLocaleDateString('en-IN')]
  ];
  
  const overviewRight = [
    ['Current Status', (application.status || 'pending').toUpperCase()],
    ['Requested Amount', application.loanSpecificDetails?.loanAmountRequired || application.loanAmount, { isCurrency: true, isHighlight: true }],
    ['Processing Priority', application.priority || 'Standard']
  ];
  
  if (application.approvedAmount) {
    overviewRight.push(['Approved Amount', application.approvedAmount, { isCurrency: true, isHighlight: true }]);
  }
  
  // Add two-column layout
  const startY = doc.y;
  
  // Left column
  doc.x = 50;
  doc.y = startY;
  overviewLeft.forEach(([label, value, options]) => {
    addField(label, value, options);
  });
  
  const leftEndY = doc.y;
  
  // Right column
  doc.x = 320;
  doc.y = startY;
  overviewRight.forEach(([label, value, options]) => {
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor(mutedColor)
       .text(`${label}:`, 320, doc.y, { width: 150 });
    
    let displayValue = value;
    if (options?.isCurrency && typeof value === 'number') {
      displayValue = `₹${value.toLocaleString('en-IN')}`;
    }
    
    doc.font('Helvetica')
       .fillColor(options?.isHighlight ? secondaryColor : textColor)
       .text(displayValue || 'N/A', 460, doc.y, { width: 120 });
    
    doc.y += 18;
  });
  
  doc.y = Math.max(leftEndY, doc.y) + 10;
  doc.x = 50;

  // Applicant Information
  const user = application.userId || application.user;
  if (user) {
    addSectionHeader('APPLICANT INFORMATION', '👤');
    
    addField('Full Name', user.name, { isHighlight: true });
    addField('Email Address', user.email);
    addField('Phone Number', user.phoneNumber, { isHighlight: true });
    addField('Date of Birth', application.personalDetails?.dateOfBirth ? 
      new Date(application.personalDetails.dateOfBirth).toLocaleDateString('en-IN') : 'N/A');
    addField('Gender', application.personalDetails?.gender);
    addField('Marital Status', application.personalDetails?.maritalStatus);
  }

  // Comprehensive Personal Details
  if (application.personalDetails) {
    addSectionHeader('PERSONAL DETAILS', '📝');
    
    addField('Father Name', application.personalDetails.fatherName);
    addField('Qualification', application.personalDetails.qualification);
    addField('Number of Dependents', application.personalDetails.numberOfDependents);
    addField('PAN Number', application.personalDetails.panNumber, { isHighlight: true });
    addField('Residence Type', application.personalDetails.residenceType);
    addField('Citizenship', application.personalDetails.citizenship);
    addField('Alternate Phone', application.personalDetails.alternatePhone);
    
    // Address Information
    if (application.personalDetails.permanentAddress || application.personalDetails.presentAddress) {
      addSectionHeader('ADDRESS INFORMATION', '🏠');
      
      if (application.personalDetails.permanentAddress) {
        const addr = application.personalDetails.permanentAddress;
        const fullAddress = [addr.address, addr.district, addr.state, addr.pinCode].filter(Boolean).join(', ');
        addField('Permanent Address', fullAddress);
      }
      
      if (application.personalDetails.presentAddress) {
        const addr = application.personalDetails.presentAddress;
        const fullAddress = [addr.address, addr.district, addr.state, addr.pinCode].filter(Boolean).join(', ');
        addField('Present Address', fullAddress);
      }
    }
  }

  // Loan Specific Details
  if (application.loanSpecificDetails && Object.keys(application.loanSpecificDetails).length > 0) {
    addSectionHeader('LOAN SPECIFIC DETAILS', '💰');
    
    addField('Loan Amount Required', application.loanSpecificDetails.loanAmountRequired, { isCurrency: true, isHighlight: true });
    addField('Property Address', application.loanSpecificDetails.propertyAddress);
    addField('Property Finalised', application.loanSpecificDetails.propertyFinalised ? 'Yes' : 'No');
    addField('Agreement Executed', application.loanSpecificDetails.agreementExecuted ? 'Yes' : 'No');
    addField('Agreement Value', application.loanSpecificDetails.agreementValue, { isCurrency: true });
    addField('Vehicle Make', application.loanSpecificDetails.vehicleMake);
    addField('Vehicle Model', application.loanSpecificDetails.vehicleModel);
    addField('Vehicle Price', application.loanSpecificDetails.vehiclePrice, { isCurrency: true });
    
    if (application.loanSpecificDetails.preferredBanks?.length > 0) {
      addField('Preferred Banks', application.loanSpecificDetails.preferredBanks.join(', '), { isHighlight: true });
    }
  }

  // Employment Details
  if (application.employmentDetails && Object.keys(application.employmentDetails).length > 0) {
    addSectionHeader('EMPLOYMENT INFORMATION', '💼');
    
    addField('Organisation Name', application.employmentDetails.organisationName || application.employmentDetails.companyName);
    addField('Organisation Type', application.employmentDetails.organisationType);
    addField('Designation', application.employmentDetails.designation);
    addField('Experience (Current)', application.employmentDetails.experienceCurrentOrg ? `${application.employmentDetails.experienceCurrentOrg} years` : 'N/A');
    addField('Experience (Previous)', application.employmentDetails.experiencePreviousOrg ? `${application.employmentDetails.experiencePreviousOrg} years` : 'N/A');
    addField('Monthly Salary', application.employmentDetails.monthlySalary || application.employmentDetails.monthlyIncome, { isCurrency: true, isHighlight: true });
    addField('Place of Posting', application.employmentDetails.placeOfPosting);
    addField('Salary Bank', application.employmentDetails.salaryBank);
    addField('Firm Name', application.employmentDetails.firmName);
    addField('Years in Business', application.employmentDetails.yearsInBusiness ? `${application.employmentDetails.yearsInBusiness} years` : 'N/A');
  }

  // Co-applicants
  if (application.coApplicants?.length > 0) {
    addSectionHeader('CO-APPLICANTS', '👥');
    
    application.coApplicants.forEach((coApp, index) => {
      doc.fontSize(12).font('Helvetica-Bold').fillColor(secondaryColor);
      doc.text(`Co-applicant ${index + 1}`, 50, doc.y);
      doc.y += 15;
      
      if (coApp.personalDetails) {
        addField('Full Name', coApp.personalDetails.fullName, { isHighlight: true });
        addField('Email', coApp.personalDetails.email);
        addField('Phone', coApp.personalDetails.phoneNumber);
      }
      
      if (coApp.employmentDetails) {
        addField('Company', coApp.employmentDetails.companyName);
        addField('Monthly Income', coApp.employmentDetails.monthlyIncome, { isCurrency: true });
      }
      
      doc.y += 10;
    });
  }

  // Documents Summary
  const documents = application.documents || application.loanDocuments || [];
  if (documents.length > 0) {
    addSectionHeader('DOCUMENTS SUBMITTED', '📄');
    
    documents.forEach((document, index) => {
      const docType = document.documentType || document.type || 'Document';
      const fileName = document.fileName || document.filename || document.originalname || document.name || 'File';
      addField(`Document ${index + 1}`, `${docType} - ${fileName}`);
    });
    
    doc.y += 10;
  }

  // Status History
  if (application.statusHistory?.length > 0) {
    addSectionHeader('APPLICATION HISTORY', '📊');
    
    application.statusHistory.forEach((history) => {
      const date = new Date(history.date || history.updatedAt).toLocaleDateString('en-IN');
      const status = (history.status || 'unknown').toUpperCase();
      const comments = history.comments ? ` - ${history.comments}` : '';
      addField(date, `${status}${comments}`);
    });
  }

  // Professional footer on last page
  doc.addPage();
  
  // Footer with company details
  const footerY = 650;
  doc.rect(0, footerY, doc.page.width, doc.page.height - footerY).fill(primaryColor);
  
  doc.fillColor('white')
     .fontSize(18)
     .font('Helvetica-Bold')
     .text('INCENTUM FINANCIAL SERVICES', 50, footerY + 30, { align: 'center' });
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('Official Loan Application Report', 50, footerY + 55, { align: 'center' });
  
  doc.fontSize(10)
     .text('This is a computer-generated official document.', 50, footerY + 80, { align: 'center' })
     .text('All information is confidential and for authorized use only.', 50, footerY + 95, { align: 'center' });
  
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 50, footerY + 120, { align: 'center' });
  doc.text('For queries: support@incentum.com | +91-1234567890', 50, footerY + 135, { align: 'center' });

  // Digital signature area
  doc.fontSize(8)
     .text('Digitally Generated by Incentum Financial Services System', 50, footerY + 160, { align: 'center' });

  // Finalize PDF
  doc.end(  );
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
  downloadDocument,
  serveDocument
}; 