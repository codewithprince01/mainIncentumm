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
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: 'Phone number must be 10 digits'
      }
    },
    email: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    gender: { 
      type: String, 
      required: false, 
      enum: ['Male', 'Female', 'Other'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Male', 'Female', 'Other'].includes(v);
        },
        message: 'Gender must be Male, Female, or Other'
      }
    },
    qualification: { 
      type: String, 
      required: false, 
      enum: ['Graduate', 'Post Graduate', 'Professional', 'Others'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Graduate', 'Post Graduate', 'Professional', 'Others'].includes(v);
        },
        message: 'Qualification must be Graduate, Post Graduate, Professional, or Others'
      }
    },
    employmentType: { 
      type: String, 
      required: false, 
      enum: ['Salaried', 'Self-Employed', 'Professional', 'Business'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Salaried', 'Self-Employed', 'Professional', 'Business'].includes(v);
        },
        message: 'Employment type must be Salaried, Self-Employed, Professional, or Business'
      }
    },
    maritalStatus: { 
      type: String, 
      required: false, 
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Single', 'Married', 'Divorced', 'Widowed'].includes(v);
        },
        message: 'Marital status must be Single, Married, Divorced, or Widowed'
      }
    },
    spouseEmploymentType: { 
      type: String, 
      enum: ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'].includes(v);
        },
        message: 'Spouse employment type must be one of the valid options'
      }
    },
    numberOfDependents: { type: Number, required: false, min: 0, max: 10 },
            panNumber: { type: String, required: false, validate: { validator: function(v) { return !v || v === '' || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v); }, message: 'Please provide a valid PAN number' } },
    residenceType: { 
      type: String, 
      required: false, 
      enum: ['Owned', 'Rented', 'Parental', 'Company Provided'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Owned', 'Rented', 'Parental', 'Company Provided'].includes(v);
        },
        message: 'Residence type must be Owned, Rented, Parental, or Company Provided'
      }
    },
    citizenship: { 
      type: String, 
      required: false, 
      enum: ['Indian', 'NRI', 'Foreign National'],
      validate: {
        validator: function(v) {
          return !v || v === '' || ['Indian', 'NRI', 'Foreign National'].includes(v);
        },
        message: 'Citizenship must be Indian, NRI, or Foreign National'
      }
    },
         permanentAddress: {
       state: { type: String, required: false },
       district: { type: String, required: false },
       address: { type: String, required: false },
       pinCode: { type: String, required: false, validate: { validator: function(v) { return !v || /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
     },
     presentAddress: {
       state: { type: String, required: false },
       district: { type: String, required: false },
       address: { type: String, required: false },
       pinCode: { type: String, required: false, validate: { validator: function(v) { return !v || /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
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
      required: false
    },
    preferredBanks: [{ type: String }]
  },

     // Step 3: Employment Details
   employmentDetails: {
     // For Salaried
     organisationName: { type: String },
     organisationType: { 
       type: String,
       enum: ['Government', 'Private', 'Public Sector', 'MNC', 'Others'],
               validate: {
          validator: function(v) {
            return !v || v === '' || ['Government', 'Private', 'Public Sector', 'MNC', 'Others'].includes(v);
          },
          message: 'Organisation type must be one of the valid options'
        }
     },
     experienceCurrentOrg: { type: Number },
     experiencePreviousOrg: { type: Number },
     designation: { type: String },
     placeOfPosting: { type: String },
     monthlySalary: { type: Number },
     salaryBank: { type: String },
    
    // For Self-Employed/Professional
    firmName: { type: String },
    firmType: { 
      type: String,
      enum: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others'],
              validate: {
          validator: function(v) {
            return !v || v === '' || ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others'].includes(v);
          },
          message: 'Firm type must be one of the valid options'
        }
    },
    firmRegistrationDate: { type: Date },
    businessDesignation: { 
      type: String,
      enum: ['Proprietor', 'Partner', 'Director', 'Others'],
              validate: {
          validator: function(v) {
            return !v || v === '' || ['Proprietor', 'Partner', 'Director', 'Others'].includes(v);
          },
          message: 'Business designation must be one of the valid options'
        }
    },
    yearsInBusiness: { type: Number, min: 0 },
    yearsOfITRFiling: { type: Number, min: 0 }
  },

  // Step 4: Documents
  documents: [{
    documentType: { 
      type: String, 
      required: false,
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
    fileName: { type: String, required: false },
    filePath: { type: String, required: false },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],

  // Step 5: Co-Applicants
  coApplicants: [{
    personalDetails: {
      fullName: { type: String, required: false },
      fatherName: { type: String, required: false },
      phoneNumber: { 
        type: String, 
        required: false,
        validate: {
          validator: function(v) {
            return !v || /^[0-9]{10}$/.test(v);
          },
          message: 'Phone number must be 10 digits'
        }
      },
      email: { type: String, required: false },
      dateOfBirth: { type: Date, required: false },
             gender: { 
         type: String, 
         required: false, 
         enum: ['Male', 'Female', 'Other'],
         validate: {
           validator: function(v) {
             return !v || v === '' || ['Male', 'Female', 'Other'].includes(v);
           },
           message: 'Gender must be Male, Female, or Other'
         }
       },
      qualification: { 
        type: String, 
        required: false, 
        enum: ['Graduate', 'Post Graduate', 'Professional', 'Others'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Graduate', 'Post Graduate', 'Professional', 'Others'].includes(v);
          },
          message: 'Qualification must be Graduate, Post Graduate, Professional, or Others'
        }
      },
      employmentType: { 
        type: String, 
        required: false, 
        enum: ['Salaried', 'Self-Employed', 'Professional', 'Business'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Salaried', 'Self-Employed', 'Professional', 'Business'].includes(v);
          },
          message: 'Employment type must be Salaried, Self-Employed, Professional, or Business'
        }
      },
      maritalStatus: { 
        type: String, 
        required: false, 
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Single', 'Married', 'Divorced', 'Widowed'].includes(v);
          },
          message: 'Marital status must be Single, Married, Divorced, or Widowed'
        }
      },
      spouseEmploymentType: { 
        type: String, 
        enum: ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Salaried', 'Self-Employed', 'Professional', 'Business', 'Housewife', 'Unemployed'].includes(v);
          },
          message: 'Spouse employment type must be one of the valid options'
        }
      },
      numberOfDependents: { type: Number, required: false, min: 0, max: 10 },
      panNumber: { type: String, required: false, validate: { validator: function(v) { return !v || v === '' || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v); }, message: 'Please provide a valid PAN number' } },
      residenceType: { 
        type: String, 
        required: false, 
        enum: ['Owned', 'Rented', 'Parental', 'Company Provided'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Owned', 'Rented', 'Parental', 'Company Provided'].includes(v);
          },
          message: 'Residence type must be Owned, Rented, Parental, or Company Provided'
        }
      },
      citizenship: { 
        type: String, 
        required: false, 
        enum: ['Indian', 'NRI', 'Foreign National'],
        validate: {
          validator: function(v) {
            return !v || v === '' || ['Indian', 'NRI', 'Foreign National'].includes(v);
          },
          message: 'Citizenship must be Indian, NRI, or Foreign National'
        }
      },
      permanentAddress: {
        state: { type: String, required: false },
        district: { type: String, required: false },
        address: { type: String, required: false },
        pinCode: { type: String, required: false, validate: { validator: function(v) { return !v || /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
      },
      presentAddress: {
        state: { type: String, required: false },
        district: { type: String, required: false },
        address: { type: String, required: false },
        pinCode: { type: String, required: false, validate: { validator: function(v) { return !v || /^[0-9]{6}$/.test(v); }, message: 'Pin code must be 6 digits' } }
      }
    },
         employmentDetails: {
       // For Salaried
       organisationName: { type: String },
       organisationType: { 
         type: String,
         enum: ['Government', 'Private', 'Public Sector', 'MNC', 'Others'],
         validate: {
           validator: function(v) {
             return !v || v === '' || ['Government', 'Private', 'Public Sector', 'MNC', 'Others'].includes(v);
           },
           message: 'Organisation type must be one of the valid options'
         }
       },
       experienceCurrentOrg: { type: Number },
       experiencePreviousOrg: { type: Number },
       designation: { type: String },
       placeOfPosting: { type: String },
       monthlySalary: { type: Number },
       salaryBank: { type: String },
       
       // For Self-Employed/Professional
       firmName: { type: String },
       firmType: { 
         type: String,
         enum: ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others'],
         validate: {
           validator: function(v) {
             return !v || v === '' || ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Others'].includes(v);
           },
           message: 'Firm type must be one of the valid options'
         }
       },
       firmRegistrationDate: { type: Date },
       businessDesignation: { 
         type: String,
         enum: ['Proprietor', 'Partner', 'Director', 'Others'],
         validate: {
           validator: function(v) {
             return !v || v === '' || ['Proprietor', 'Partner', 'Director', 'Others'].includes(v);
           },
           message: 'Business designation must be one of the valid options'
         }
       },
       yearsInBusiness: { type: Number },
       yearsOfITRFiling: { type: Number }
     },
    documents: [{
      documentType: { 
        type: String, 
        required: false,
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
      fileName: { type: String, required: false },
      filePath: { type: String, required: false },
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
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (01-12)
      const day = String(now.getDate()).padStart(2, '0'); // Day (01-31)
      
      // Find the highest number for today's date
      const todayPrefix = `${year}${month}${day}`;
      const todayApplications = await mongoose.model('LoanApplication').find({
        applicationId: { $regex: `^${todayPrefix}` }
      }).sort({ applicationId: -1 }).limit(1);
      
      let nextNumber = 1;
      if (todayApplications.length > 0) {
        // Extract the 4-digit number from the last application of today
        const lastAppId = todayApplications[0].applicationId;
        const lastNumber = parseInt(lastAppId.slice(-4));
        nextNumber = lastNumber + 1;
      }
      
      // Format: YYMMDD0001 (e.g., 2508040001 for Aug 4, 2025, first application)
      this.applicationId = `${todayPrefix}${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating application ID:', error);
      // Fallback to timestamp-based ID if counter fails
      const timestamp = Date.now();
      const year = new Date().getFullYear().toString().slice(-2);
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const day = String(new Date().getDate()).padStart(2, '0');
      this.applicationId = `${year}${month}${day}${String(timestamp).slice(-4)}`;
    }
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