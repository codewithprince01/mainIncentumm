const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  applicationId: {
    type: String,
    unique: true
  },
  loanType: {
    type: String,
    required: true,
    enum: ['home', 'personal', 'business', 'vehicle', 'mortgage']
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'closed'],
    default: 'draft'
  },
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 5
  },
  
  // Step 1: Personal Details & Address (Same for all loans)
  personalDetails: {
    fullName: { type: String, required: false },
    fatherName: { type: String, required: false },
    phoneNumber: { 
      type: String, 
      required: false,
      validate: {
        validator: function(v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    email: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    gender: { type: String, required: false, enum: ['Male', 'Female', 'Other'] },
    qualification: { type: String, required: false, enum: ['Graduate', 'Post Graduate', 'Professional', 'Others'] },
    employmentType: { type: String, required: false, enum: ['Salaried', 'Self-Employed', 'Professional', 'Business'] },
    maritalStatus: { type: String, required: false, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    spouseEmploymentType: { type: String, enum: ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'] },
    numberOfDependents: { type: Number, required: false, min: 0, max: 10 },
    panNumber: { type: String, required: false, validate: { validator: function(v) { return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v); }, message: 'Please provide a valid PAN number' } },
    residenceType: { type: String, required: false, enum: ['Owned', 'Rented', 'Parental', 'Company Provided'] },
    citizenship: { type: String, required: false, enum: ['Indian', 'NRI', 'Foreign National'] },
    permanentAddress: {
      state: { type: String, required: false },
      district: { type: String, required: false },
      address: { type: String, required: false },
      pinCode: { type: String, required: false, validate: { validator: function(v) { return /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
    },
    presentAddress: {
      state: { type: String, required: false },
      district: { type: String, required: false },
      address: { type: String, required: false },
      pinCode: { type: String, required: false, validate: { validator: function(v) { return /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
    }
  },

  // Step 2: Loan/Property/Vehicle Specific Details
  loanSpecificDetails: {
    // For Home, Business, Mortgage Loans
    propertyFinalised: { type: Boolean },
    propertyAddress: { type: String },
    agreementExecuted: { type: Boolean },
    agreementValue: { type: Number, min: 0 },
    
    // For Vehicle Loan
    vehicleMake: { type: String },
    vehicleModel: { type: String },
    expectedDeliveryDate: { type: Date },
    dealerName: { type: String },
    dealerCity: { type: String },
    vehiclePrice: { type: Number, min: 0 },
    
    // Common for all loans
    loanAmountRequired: { 
      type: Number, 
      required: false,
      min: [10000, 'Minimum loan amount is ₹10,000']
    },
    preferredBanks: [{ type: String }]
  },

  // Step 3: Employment Details
  employmentDetails: {
    // For Salaried
    organisationName: { type: String },
    organisationType: { 
      type: String,
      enum: ['Government', 'Private', 'Public Sector', 'MNC', 'Others']
    },
    experienceCurrentOrg: { type: Number, min: 0 },
    experiencePreviousOrg: { type: Number, min: 0 },
    designation: { type: String },
    placeOfPosting: { type: String },
    monthlySalary: { type: Number, min: 0 },
    salaryBank: { type: String },
    
    // For Self-Employed/Professional
    firmName: { type: String },
    firmType: { 
      type: String,
      enum: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others']
    },
    firmRegistrationDate: { type: Date },
    businessDesignation: { 
      type: String,
      enum: ['Proprietor', 'Partner', 'Director', 'Others']
    },
    yearsInBusiness: { type: Number, min: 0 },
    yearsOfITRFiling: { type: Number, min: 0 }
  },

  // Step 4: Documents
  documents: [{
    documentType: { 
      type: String, 
      required: true,
      enum: [
        // Common documents
        'panCard', 'aadharCard', 'existingLoanStatement', 'itr', 'nocLoanClosure',
        // Salaried documents
        'employerIdCard', 'experienceLetter', 'salaryAccountStatement', 'salarySlip', 'form16',
        // Self-employed documents
        'firmRegistration', 'gstr', 'currentAccountStatement', 'savingsAccountStatement', 'balanceSheet',
        // Business documents
        'panCardFirm', 'kycDirectors', 'incorporationCertificate', 'articleAssociation', 'memorandumAssociation', 'businessAccountStatement', 'otherDocuments',
        // Vehicle documents
        'drivingLicense'
      ]
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],

  // Step 5: Co-Applicants
  coApplicants: [{
    personalDetails: {
      fullName: { type: String, required: true },
      fatherName: { type: String, required: false },
      phoneNumber: { 
        type: String, 
        required: true,
        validate: {
          validator: function(v) {
            return /^[0-9]{10}$/.test(v);
          },
          message: 'Phone number must be 10 digits'
        }
      },
      email: { type: String, required: false },
      dateOfBirth: { type: Date, required: false },
      gender: { type: String, required: false, enum: ['Male', 'Female', 'Other'] },
      qualification: { type: String, required: false, enum: ['Graduate', 'Post Graduate', 'Professional', 'Others'] },
      employmentType: { type: String, required: false, enum: ['Salaried', 'Self-Employed', 'Professional', 'Business'] },
      maritalStatus: { type: String, required: false, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
      spouseEmploymentType: { type: String, enum: ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'] },
      numberOfDependents: { type: Number, required: false, min: 0, max: 10 },
      panNumber: { type: String, required: false, validate: { validator: function(v) { return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v); }, message: 'Please provide a valid PAN number' } },
      residenceType: { type: String, required: false, enum: ['Owned', 'Rented', 'Parental', 'Company Provided'] },
      citizenship: { type: String, required: false, enum: ['Indian', 'NRI', 'Foreign National'] },
      permanentAddress: {
        state: { type: String, required: false },
        district: { type: String, required: false },
        address: { type: String, required: false },
        pinCode: { type: String, required: false, validate: { validator: function(v) { return /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
      },
      presentAddress: {
        state: { type: String, required: false },
        district: { type: String, required: false },
        address: { type: String, required: false },
        pinCode: { type: String, required: false, validate: { validator: function(v) { return /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
      }
    },
    employmentDetails: {
      // For Salaried
      organisationName: { type: String },
      organisationType: { 
        type: String,
        enum: ['Government', 'Private', 'Public Sector', 'MNC', 'Others']
      },
      experienceCurrentOrg: { type: Number, min: 0 },
      experiencePreviousOrg: { type: Number, min: 0 },
      designation: { type: String },
      placeOfPosting: { type: String },
      monthlySalary: { type: Number, min: 0 },
      salaryBank: { type: String },
      
      // For Self-Employed/Professional
      firmName: { type: String },
      firmType: { 
        type: String,
        enum: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others']
      },
      firmRegistrationDate: { type: Date },
      businessDesignation: { 
        type: String,
        enum: ['Proprietor', 'Partner', 'Director', 'Others']
      },
      yearsInBusiness: { type: Number, min: 0 },
      yearsOfITRFiling: { type: Number, min: 0 }
    },
    documents: [{
      documentType: { 
        type: String, 
        enum: [
          // Common documents
          'panCard', 'aadharCard', 'existingLoanStatement', 'itr', 'nocLoanClosure',
          // Salaried documents
          'employerIdCard', 'experienceLetter', 'salaryAccountStatement', 'salarySlip', 'form16',
          // Self-employed documents
          'firmRegistration', 'gstr', 'currentAccountStatement', 'savingsAccountStatement', 'balanceSheet',
          // Vehicle documents
          'drivingLicense'
        ]
      },
      fileName: { type: String },
      filePath: { type: String },
      uploadedAt: { type: Date, default: Date.now },
      verified: { type: Boolean, default: false }
    }]
  }],
  
  // Additional Financial Information
  financialDetails: {
    existingLoans: [{
      loanType: String,
      lender: String,
      outstandingAmount: Number,
      emi: Number
    }],
    monthlyExpenses: Number,
    totalMonthlyIncome: Number
  },
  
  // Application Metadata
  submittedAt: Date,
  lastModifiedAt: { type: Date, default: Date.now },
  assignedTo: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Comments and Notes
  comments: [{
    message: String,
    addedBy: String,
    addedAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],
  
  // Status History
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
    remarks: String
  }]
}, {
  timestamps: true
});

// Generate unique application ID
loanApplicationSchema.pre('save', async function(next) {
  if (!this.applicationId && this.isNew) {
    const count = await mongoose.model('LoanApplication').countDocuments();
    const year = new Date().getFullYear();
    this.applicationId = `INCNT${year}${String(count + 1).padStart(6, '0')}`;
  }
  this.lastModifiedAt = new Date();
  next();
});

// Add status to history when status changes
loanApplicationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
      updatedBy: 'system'
    });
  }
  next();
});

// Indexes for performance
loanApplicationSchema.index({ userId: 1, status: 1 });
loanApplicationSchema.index({ submittedAt: -1 });
loanApplicationSchema.index({ loanType: 1, status: 1 });

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = { LoanApplication }; 