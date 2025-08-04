const asyncHandler = require("express-async-handler");
const { LoanApplication } = require("../models/LoanApplication.model");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// ====================== Create New Application ======================
const createApplication = asyncHandler(async (req, res) => {
  const { userId, loanType } = req.body;

  if (!userId || !loanType) {
    return res.status(400).json({
      success: false,
      message: "User ID and loan type are required"
    });
  }

  if (!['home', 'personal', 'business', 'vehicle', 'mortgage'].includes(loanType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid loan type"
    });
  }

  try {
    const application = new LoanApplication({
      userId,
      loanType,
      currentStep: 1,
      status: 'draft'
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: {
        applicationId: application._id,
        applicationNumber: application.applicationId,
        loanType: application.loanType,
        currentStep: application.currentStep
      }
    });

  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create application",
      error: error.message
    });
  }
});

// ====================== Save Step Data ======================
const saveStepData = asyncHandler(async (req, res) => {


  const { applicationId, step, stepData } = req.body;

  if (!applicationId || !step || !stepData) {

    return res.status(400).json({
      success: false,
      message: "Application ID, step, and step data are required"
    });
  }

  if (step < 1 || step > 5) {
    return res.status(400).json({
      success: false,
      message: "Step must be between 1 and 5"
    });
  }

  try {

    const application = await LoanApplication.findById(applicationId);
    
    if (!application) {

      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }



    // Helper function to clean empty strings for enum fields and handle address objects
    const cleanEnumFields = (data) => {
      const cleaned = {};
      
      // Define enum fields that shouldn't have empty strings
      const enumFields = [
        'employmentType', 'spouseEmploymentType', 'residenceType', 'citizenship',
        'gender', 'maritalStatus', 'qualification', 'organisationType', 'firmType', 'businessDesignation'
      ];
      
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Skip undefined, null, and "undefined" strings
        if (value === undefined || value === null || value === 'undefined') {
          return; // Don't include this key at all
        }
        
        // Skip empty strings for enum fields to avoid validation errors
        if (enumFields.includes(key) && value === '') {
          console.log(`⚠️ Skipping enum field ${key} with empty value`);
          return; // Don't include empty enum fields
        }
        
        // Skip empty address objects
        if ((key === 'permanentAddress' || key === 'presentAddress') && 
            (typeof value === 'object' && Object.keys(value).length === 0)) {
          return; // Don't include empty address objects
        }
        
        // Handle PAN number formatting
        if (key === 'panNumber' && value) {
          cleaned[key] = value.toUpperCase();
          return;
        }
        
        cleaned[key] = value;
      });
      return cleaned;
    };

    // Update step data based on step number
    switch (step) {
      case 1: // Personal Details & Address
        const cleanedStepData = cleanEnumFields(stepData);
        
        // Remove address objects from cleanedStepData to handle them separately
        const { permanentAddress, presentAddress, ...otherStepData } = cleanedStepData;
        
        // Update non-address fields safely
        if (!application.personalDetails) {
          application.personalDetails = {};
        }
        
        // Clean up any existing corrupted address objects first
        if (application.personalDetails.permanentAddress === undefined || application.personalDetails.permanentAddress === null) {
          delete application.personalDetails.permanentAddress;
        }
        if (application.personalDetails.presentAddress === undefined || application.personalDetails.presentAddress === null) {
          delete application.personalDetails.presentAddress;
        }
        
        // Update each field individually to avoid spreading undefined address objects
        Object.keys(otherStepData).forEach(key => {
          if (otherStepData[key] !== undefined && otherStepData[key] !== null) {
            console.log(`🔍 Setting personalDetails.${key} = ${otherStepData[key]}`);
            application.personalDetails[key] = otherStepData[key];
          } else {
            console.log(`⚠️ Skipping personalDetails.${key} (value: ${otherStepData[key]})`);
          }
        });

        console.log('🔍 Final personalDetails after step 1:', application.personalDetails);

        // Only set address objects if they have actual data
        if (stepData.permanentAddress && typeof stepData.permanentAddress === 'object' && 
            stepData.permanentAddress !== 'undefined' && stepData.permanentAddress !== null &&
            Object.keys(stepData.permanentAddress).length > 0) {
          console.log('🔍 Setting permanentAddress:', stepData.permanentAddress);
          application.personalDetails.permanentAddress = stepData.permanentAddress;
        }
        
        if (stepData.presentAddress && typeof stepData.presentAddress === 'object' && 
            stepData.presentAddress !== 'undefined' && stepData.presentAddress !== null &&
            Object.keys(stepData.presentAddress).length > 0) {
          console.log('🔍 Setting presentAddress:', stepData.presentAddress);
          application.personalDetails.presentAddress = stepData.presentAddress;
        }
        break;
        
      case 2: // Loan/Property/Vehicle Specific Details
        application.loanSpecificDetails = {
          ...application.loanSpecificDetails,
          ...cleanEnumFields(stepData)
        };
        break;
        
      case 3: // Employment Details
        application.employmentDetails = {
          ...application.employmentDetails,
          ...cleanEnumFields(stepData)
        };
        break;
        
      case 4: // Documents - handled separately in uploadDocument
        // Documents are handled in the uploadDocument endpoint
        break;
        
              case 5: // Co-Applicants
          if (stepData.coApplicants) {
          // Special cleaning for co-applicants - preserve structure but clean enum fields
          const cleanedCoApplicants = stepData.coApplicants.map(coApplicant => {
            // Clean personal details but preserve structure and map field names
            const cleanedPersonalDetails = {};
            if (coApplicant.personalDetails) {
              Object.keys(coApplicant.personalDetails).forEach(key => {
                const value = coApplicant.personalDetails[key];
                // Only skip undefined, null, and "undefined" strings
                if (value !== undefined && value !== null && value !== 'undefined') {
                  // Map field names to match schema
                  let mappedKey = key;
                  if (key === 'full_name') mappedKey = 'fullName';
                  if (key === 'mobile_number') mappedKey = 'phoneNumber';
                  if (key === 'father_name') mappedKey = 'fatherName';
                  if (key === 'email_id') mappedKey = 'email';
                  if (key === 'dob') mappedKey = 'dateOfBirth';
                  if (key === 'marital_status') mappedKey = 'maritalStatus';
                  if (key === 'pan_number') mappedKey = 'panNumber';
                  if (key === 'residence_type') mappedKey = 'residenceType';
                  if (key === 'permanent_address') {
                    // Handle permanent address as nested object
                    if (!cleanedPersonalDetails.permanentAddress) {
                      cleanedPersonalDetails.permanentAddress = {};
                    }
                    cleanedPersonalDetails.permanentAddress.address = value;
                  } else if (key === 'permanent_pincode') {
                    if (!cleanedPersonalDetails.permanentAddress) {
                      cleanedPersonalDetails.permanentAddress = {};
                    }
                    cleanedPersonalDetails.permanentAddress.pinCode = value;
                  } else if (key === 'present_address') {
                    // Handle present address as nested object
                    if (!cleanedPersonalDetails.presentAddress) {
                      cleanedPersonalDetails.presentAddress = {};
                    }
                    cleanedPersonalDetails.presentAddress.address = value;
                  } else if (key === 'present_pincode') {
                    if (!cleanedPersonalDetails.presentAddress) {
                      cleanedPersonalDetails.presentAddress = {};
                    }
                    cleanedPersonalDetails.presentAddress.pinCode = value;
                  } else {
                    // Handle PAN number formatting
                    if (mappedKey === 'panNumber') {
                      cleanedPersonalDetails[mappedKey] = value.toUpperCase();
                    } else {
                      cleanedPersonalDetails[mappedKey] = value;
                    }
                  }
                }
              });
            }
            
            // Clean employment details but preserve structure and map field names
            const cleanedEmploymentDetails = {};
            if (coApplicant.employmentDetails) {
              Object.keys(coApplicant.employmentDetails).forEach(key => {
                const value = coApplicant.employmentDetails[key];
                // Only skip undefined, null, and "undefined" strings
                if (value !== undefined && value !== null && value !== 'undefined') {
                  // Map field names to match schema
                  let mappedKey = key;
                  if (key === 'employment_type') mappedKey = 'employmentType';
                  if (key === 'organisation_name') mappedKey = 'organisationName';
                  if (key === 'organisation_type') mappedKey = 'organisationType';
                  if (key === 'designation_salaried') mappedKey = 'designation';
                  if (key === 'currentOrganizationExperience') mappedKey = 'experienceCurrentOrg';
                  if (key === 'previousOrganizationExperience') mappedKey = 'experiencePreviousOrg';
                  if (key === 'monthly_salary') mappedKey = 'monthlySalary';
                  if (key === 'place_of_posting') mappedKey = 'placeOfPosting';
                  if (key === 'salary_bank_name') mappedKey = 'salaryBank';
                  if (key === 'company_name') mappedKey = 'companyName';
                  if (key === 'company_type') mappedKey = 'companyType';
                  if (key === 'incorporation_date') mappedKey = 'incorporationDate';
                  if (key === 'designation_self') mappedKey = 'designation';
                  if (key === 'years_in_business') mappedKey = 'yearsInBusiness';
                  if (key === 'years_of_itr_filing') mappedKey = 'yearsOfITRFiling';
                  if (key === 'annual_income') mappedKey = 'annualIncome';
                  if (key === 'business_address') mappedKey = 'businessAddress';
                  if (key === 'firm_name') mappedKey = 'firmName';
                  if (key === 'firm_type') mappedKey = 'firmType';
                  if (key === 'firm_registration_date') mappedKey = 'firmRegistrationDate';
                  if (key === 'business_designation') mappedKey = 'businessDesignation';
                  
                  cleanedEmploymentDetails[mappedKey] = value;
                }
              });
            }
            
            return {
              ...coApplicant,
              personalDetails: cleanedPersonalDetails,
              employmentDetails: cleanedEmploymentDetails
            };
          });
          
          // Filter out empty co-applicants (no name and no phone)
          // Handle both naming conventions: fullName/full_name and phoneNumber/mobile_number
          application.coApplicants = cleanedCoApplicants.filter(co => {
            if (!co || !co.personalDetails) {
              return false;
            }
            
            const hasName = co.personalDetails.fullName || co.personalDetails.full_name;
            const hasPhone = co.personalDetails.phoneNumber || co.personalDetails.mobile_number;
            
            return hasName || hasPhone;
          });
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid step number"
        });
    }

    // Filter out empty co-applicants before saving (defensive, for all steps)
    if (Array.isArray(application.coApplicants)) {
      application.coApplicants = application.coApplicants.filter(co => {
        if (!co || !co.personalDetails) {
          return false;
        }
        
        const hasName = co.personalDetails.fullName || co.personalDetails.full_name;
        const hasPhone = co.personalDetails.phoneNumber || co.personalDetails.mobile_number;
        
        return hasName || hasPhone;
      });
    }

    // Update current step if progressing forward
    if (step > application.currentStep) {
      application.currentStep = step;
    }

    await application.save();

    console.log('✅ Application saved successfully for step', step);
    
    // Verify what was actually saved
    const savedApp = await LoanApplication.findById(applicationId);
    console.log('🔍 Verification - What was actually saved to DB:', {
      id: savedApp._id,
      hasPersonalDetails: !!savedApp.personalDetails,
      personalDetailsKeys: savedApp.personalDetails ? Object.keys(savedApp.personalDetails) : 'none',
      personalDetails: savedApp.personalDetails,
      hasEmploymentDetails: !!savedApp.employmentDetails,
      employmentDetails: savedApp.employmentDetails,
      hasLoanSpecificDetails: !!savedApp.loanSpecificDetails,
      loanSpecificDetails: savedApp.loanSpecificDetails
    });

    res.status(200).json({
      success: true,
      message: "Step data saved successfully",
      data: {
        applicationId: application._id,
        currentStep: application.currentStep,
        stepData: getStepData(application, step)
      }
    });

  } catch (error) {
    console.error("❌ Error saving step data:", error);
    console.error("❌ Error details:", error.message);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to save step data",
      error: error.message
    });
  }
});

// ====================== Upload Document ======================
const uploadDocument = asyncHandler(async (req, res) => {
  upload.single('document')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: err.message
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: "File upload error",
        error: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const { applicationId, documentType, applicantType = 'main' } = req.body;

    if (!applicationId || !documentType) {
      return res.status(400).json({
        success: false,
        message: "Application ID and document type are required"
      });
    }

    try {
      const application = await LoanApplication.findById(applicationId);
      
      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found"
        });
      }

      const documentData = {
        documentType,
        fileName: req.file.originalname,
        filePath: req.file.path,
        uploadedAt: new Date()
      };

      if (applicantType === 'main') {
        // Add to main applicant documents
        application.documents.push(documentData);
      } else {
        // Add to co-applicant documents
        const coApplicantIndex = parseInt(applicantType.replace('coApplicant', '')) - 1;
        if (application.coApplicants[coApplicantIndex]) {
          application.coApplicants[coApplicantIndex].documents.push(documentData);
        }
      }

      await application.save();

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: "Document uploaded successfully",
        data: {
          fileUrl,
          fileName: req.file.originalname,
          documentType
        }
      });

    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload document",
        error: error.message
      });
    }
  });
});

// ====================== Get Application Data ======================
const getApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      success: false,
      message: "Valid application ID is required"
    });
  }

  try {
    const application = await LoanApplication.findById(applicationId).populate("userId", "name email phoneNumber");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Application data retrieved successfully",
      data: application
    });

  } catch (error) {
    console.error("Error getting application data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get application data",
      error: error.message
    });
  }
});

// ====================== Get User Applications ======================
const getUserApplications = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Valid user ID is required"
    });
  }

  try {
    const applications = await LoanApplication.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User applications retrieved successfully",
      data: applications
    });

  } catch (error) {
    console.error("Error getting user applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user applications",
      error: error.message
    });
  }
});

// ====================== Submit Application ======================
const submitApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.body;

  if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      success: false,
      message: "Valid application ID is required"
    });
  }

  try {
    const application = await LoanApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Defensive: filter out empty co-applicants before validation and saving
    if (Array.isArray(application.coApplicants)) {
      application.coApplicants = application.coApplicants.filter(
        co => co && co.personalDetails && (co.personalDetails.fullName || co.personalDetails.phoneNumber)
      );
    }

    // Validate that all required steps are completed
    const validationErrors = validateApplication(application);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Application validation failed",
        errors: validationErrors
      });
    }

    // Update application status
    application.status = "submitted";
    application.submittedAt = new Date();
    application.currentStep = 5; // Mark as completed
    
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: application._id,
        applicationNumber: application.applicationId,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message
    });
  }
});

// ====================== Helper Functions ======================
const getStepData = (application, step) => {
  switch (step) {
    case 1:
      return application.personalDetails;
    case 2:
      return application.loanSpecificDetails;
    case 3:
      return application.employmentDetails;
    case 4:
      return application.documents;
    case 5:
      return application.coApplicants;
    default:
      return null;
  }
};

const validateApplication = (application) => {
  const errors = [];

  // Validate personal details - only name and phone number required
  if (!application.personalDetails?.fullName || application.personalDetails.fullName.trim() === '') {
    errors.push("Full name is required");
  }
  
  if (!application.personalDetails?.phoneNumber || application.personalDetails.phoneNumber.trim() === '') {
    errors.push("Phone number is required");
  }

  // Validate co-applicants - only name and phone number required (only if co-applicants exist)
  if (Array.isArray(application.coApplicants) && application.coApplicants.length > 0) {
    application.coApplicants.forEach((co, idx) => {
      if (!co.personalDetails?.fullName || co.personalDetails.fullName.trim() === '') {
        errors.push(`Co-applicant ${idx + 1}: Full name is required`);
      }
      if (!co.personalDetails?.phoneNumber || co.personalDetails.phoneNumber.trim() === '') {
        errors.push(`Co-applicant ${idx + 1}: Phone number is required`);
      }
    });
  }

  // Validate loan specific details - loan amount is optional
  // if (!application.loanSpecificDetails?.loanAmountRequired) {
  //   errors.push("Loan amount is required");
  // }

  // Validate employment details - employment details are optional
  // if (!application.employmentDetails || Object.keys(application.employmentDetails).length === 0) {
  //   errors.push("Employment details are required");
  // }

  // Validate documents - documents are optional for now
  // const requiredDocuments = getRequiredDocuments(application.loanType, application.personalDetails?.employmentType);
  // const uploadedDocuments = application.documents?.map(doc => doc.documentType) || [];
  
  // const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));
  // if (missingDocuments.length > 0) {
  //   errors.push(`Missing required documents: ${missingDocuments.join(', ')}`);
  // }

  return errors;
};

const getRequiredDocuments = (loanType, employmentType) => {
  const commonDocs = ['panCard', 'aadharCard'];
  
  let employmentDocs = [];
  if (employmentType === 'Salaried') {
    employmentDocs = ['employerIdCard', 'experienceLetter', 'salaryAccountStatement', 'salarySlip', 'form16', 'itr'];
  } else if (employmentType === 'Self-Employed' || employmentType === 'Professional') {
    employmentDocs = ['firmRegistration', 'gstr', 'currentAccountStatement', 'savingsAccountStatement', 'balanceSheet', 'itr', 'nocLoanClosure'];
  } else if (employmentType === 'Business') {
    employmentDocs = ['panCardFirm', 'kycDirectors', 'firmRegistration', 'incorporationCertificate', 'articleAssociation', 'memorandumAssociation', 'gstr', 'businessAccountStatement', 'savingsAccountStatement', 'itr', 'balanceSheet', 'nocLoanClosure', 'otherDocuments'];
  }

  let loanSpecificDocs = [];
  if (loanType === 'vehicle') {
    loanSpecificDocs = ['drivingLicense'];
  }

  return [...commonDocs, ...employmentDocs, ...loanSpecificDocs];
};

// ====================== Delete Application ======================
const deleteApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
    return res.status(400).json({
      success: false,
      message: "Valid application ID is required"
    });
  }

  try {
    const application = await LoanApplication.findByIdAndDelete(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Application deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message
    });
  }
});

module.exports = {
  createApplication,
  saveStepData,
  uploadDocument,
  getApplication,
  getUserApplications,
  submitApplication,
  deleteApplication
}; 