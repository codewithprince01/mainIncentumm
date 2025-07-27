const { default: mongoose } = require("mongoose");
const Form = require("../models/individualForms/FormOne.model");
const { asyncHandler } = require("../utils/asyncHandler");
const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// Dynamic Multer fields based on number of applicants
const getUploadFields = (numberOfApplicants) => {
  const baseFields = [
    "panCard",
    "aadharCard",
    "employerIDCard",
    "joiningConfirmationExperienceLetter",
    "last12MonthSalaryAccountStatement",
    "last12MonthSavingsBankAccountStatement",
    "existingLoanAccountStatement",
    "latest6MonthSalarySlip",
    "form16PartABAnd26AS",
    "itrAndComputation",
    "firmRegistrationCertificate",
    "gstrLastYear",
    "last6Or12MonthCurrentAccountStatement",
    "balanceSheets",
    "nocLoanCloseStatements",
    "drivingLicense",
    "kycProprietorPartnersDirectors",
    "certificateForIncorporation",
    "articleOfAssociation",
    "memorandumOfAssociation",
    "businessAccountStatement",
    "otherRelevantDocuments",
    "panCardofFirm",
    "last12MonthSavingsAccountStatement",
  ];

  const fields = [];
  for (let i = 0; i < numberOfApplicants; i++) {
    baseFields.forEach((field) => {
      fields.push({ name: `${i}_${field}`, maxCount: 1 });
    });
  }
  return fields;
};

// Middleware to handle file uploads
const handleFileUploads = asyncHandler(async (req, res, next) => {
  // Defer userId validation to saveLoanDocuments after Multer parsing
  const dynamicUpload = upload.fields(getUploadFields(2)); // Default to 2 applicants, adjust if dynamic lookup needed

  dynamicUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer Error: ${err.message}`, field: err.field });
    } else if (err) {
      return res.status(500).json({ message: "File upload error", error: err.message });
    }
    next();
  });
});

// ====================== Step 1: Save Personal Details ======================
const savePersonalDetails = asyncHandler(async (req, res) => {
  const { userId, applicants } = req.body;

  if (!userId || !applicants || !Array.isArray(applicants) || applicants.length === 0) {
    return res.status(400).json({ message: "userId and applicants array are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  for (const applicant of applicants) {
    if (!applicant.full_name || !applicant.email_id) {
      return res.status(400).json({
        message: "full_name and email_id are required for all applicants",
      });
    }
    if (applicant.mobile_number && !/^[0-9]{10}$/.test(applicant.mobile_number)) {
      return res.status(400).json({ message: "mobile_number must be a 10-digit number" });
    }
    if (applicant.permanent_pincode && !/^[0-9]{6}$/.test(applicant.permanent_pincode)) {
      return res.status(400).json({ message: "permanent_pincode must be a 6-digit number" });
    }
    if (applicant.present_pincode && !/^[0-9]{6}$/.test(applicant.present_pincode)) {
      return res.status(400).json({ message: "present_pincode must be a 6-digit number" });
    }
  }

  try {
    let form = await Form.findOne({ user: userId });

    if (!form) {
      form = new Form({
        user: userId,
        personalDetails: applicants,
        loanApplication: {},
        loanDocuments: [],
        status: "Pending",
      });
    } else {
      form.personalDetails = applicants;
    }
    await form.save();
    console.log("Form document saved successfully:", form.toObject());
    res.status(200).json({ message: "Personal details saved successfully", data: form });
  } catch (error) {
    console.error("Error saving personal details:", error);
    res.status(500).json({ message: "Failed to save personal details", error: error.message });
  }
});

// ====================== Step 2: Save Loan Application ======================
const saveLoanApplication = asyncHandler(async (req, res) => {
  console.log("Request body received:", req.body);

  const { userId, loanType, numberOfApplicants, applicants, commonDetails } = req.body;

  if (!userId || !loanType || !applicants || !Array.isArray(applicants) || applicants.length === 0) {
    return res.status(400).json({ message: "userId, loanType, and applicants array are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  for (const applicant of applicants) {
    if (!applicant.user_type) {
      return res.status(400).json({ message: "user_type is required for all applicants" });
    }
  }

  try {
    let form = await Form.findOne({ user: userId });

    const transformedApplicants = applicants.map((applicant) => {
      const { user_type, ...rest } = applicant;
      return {
        user_type,
        salariedDetails:
          user_type === "Salaried"
            ? {
                organisation_name: rest.organisation_name || "",
                organisation_type: rest.organisation_type || "",
                currentOrganizationExperience: rest.currentOrganizationExperience || "",
                previousOrganizationExperience: rest.previousOrganizationExperience || "",
                designation_salaried: rest.designation_salaried || "",
                place_of_posting: rest.place_of_posting || "",
                monthly_salary: rest.monthly_salary || "",
                salary_bank_name: rest.salary_bank_name || "",
              }
            : null,
        selfEmployedDetails:
          user_type === "Self-Employed"
            ? {
                company_name: rest.company_name || "",
                company_type: rest.company_type || "",
                incorporation_date: rest.incorporation_date || "",
                designation_self: rest.designation_self || "",
                years_in_business: rest.years_in_business || "",
                years_of_itr_filing: rest.years_of_itr_filing || "",
              }
            : null,
      };
    });

    const loanApplicationData = {
      loanType,
      applicants: transformedApplicants,
      property_finalised: commonDetails?.property_finalised || "",
      property_address: commonDetails?.property_address || "",
      agreement_executed: commonDetails?.agreement_executed || "",
      agreement_mou_value: commonDetails?.agreement_mou_value || "",
      loan_amount_required: commonDetails?.loan_amount_required || "",
      preferred_banks: commonDetails?.preferred_banks || "",
      vehicleDetails:
        loanType === "Vehicle Loan"
          ? {
              vehicleModel: commonDetails?.vehicleModel || "",
              expectedDeliveryDate: commonDetails?.expectedDeliveryDate || "",
              dealerName: commonDetails?.dealerName || "",
              dealerCity: commonDetails?.dealerCity || "",
              vehiclePrice: commonDetails?.vehiclePrice || "",
            }
          : null,
    };

    if (!form) {
      console.log("Creating new Form document for user:", userId);
      form = new Form({
        user: userId,
        personalDetails: [],
        loanApplication: loanApplicationData,
        loanDocuments: [],
        status: "Pending",
      });
    } else {
      console.log("Updating existing Form document for user:", userId);
      form.loanApplication = loanApplicationData;
    }

    await form.save();
    console.log("Form document saved successfully:", form.toObject());
    res.status(200).json({ message: "Loan application saved successfully", data: form });
  } catch (error) {
    console.error("Error saving loan application:", error);
    res.status(500).json({ message: "Failed to save loan application", error: error.message });
  }
});

// ====================== Step 3: Save Loan Documents ======================
const saveLoanDocuments = asyncHandler(async (req, res) => {
  try {
    console.log("1. Request Body (after Multer):", req.body);
    console.log("2. Uploaded Files (raw):", JSON.stringify(req.files, null, 2));

    const { userId } = req.body;

    if (!userId) {
      console.log("3. userId missing in req.body");
      return res.status(400).json({ message: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("3. Invalid userId format:", userId);
      return res.status(400).json({ message: "Invalid userId format" });
    }

    let form = await Form.findOne({ user: userId });
    console.log("3. Found Form:", form ? form.toObject() : "No form found");

    if (!form || !form.loanApplication || !form.loanApplication.applicants.length) {
      console.log("3. Form validation failed: Steps 1 and 2 not completed");
      return res.status(400).json({ message: "Please complete Step 1 and Step 2 first" });
    }

    const numberOfApplicants = form.loanApplication.applicants.length;
    console.log("4. Number of Applicants:", numberOfApplicants);

    const expectedFields = getUploadFields(numberOfApplicants).map((f) => f.name);
    console.log("5. Expected Fields:", expectedFields);

    const uploadedFields = Object.keys(req.files || {});
    console.log("5. Uploaded Fields:", uploadedFields);

    const unexpectedFields = uploadedFields.filter((field) => !expectedFields.includes(field));
    if (unexpectedFields.length > 0) {
      console.log("5. Unexpected fields detected:", unexpectedFields);
      return res.status(400).json({
        message: "Unexpected fields in file upload",
        unexpectedFields,
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("6. No files uploaded or req.files is empty");
      return res.status(400).json({ message: "No files uploaded" });
    }

    const loanDocumentsArray = Array(numberOfApplicants)
      .fill()
      .map(() => ({}));

    for (const [fieldName, fileArray] of Object.entries(req.files)) {
      if (fileArray && fileArray.length > 0) {
        let applicantIndex = 0;
        let docType = fieldName;

        console.log("6. Processing Field:", fieldName);

        if (fieldName.includes("_")) {
          const [indexStr, type] = fieldName.split("_");
          const index = parseInt(indexStr, 10);
          if (!isNaN(index) && index >= 0 && index < numberOfApplicants) {
            applicantIndex = index;
            docType = type;
          } else {
            console.warn(`Invalid applicant index in field: ${fieldName}, defaulting to 0`);
          }
        } else {
          console.warn(`Malformed field name: ${fieldName}, skipping`);
          continue;
        }

        console.log(`7. Assigning ${docType} to applicant ${applicantIndex}: ${fileArray[0].path}`);
        loanDocumentsArray[applicantIndex][docType] = fileArray[0].path;
      }
    }

    console.log("8. Loan Documents Array Before Save:", JSON.stringify(loanDocumentsArray, null, 2));

    form.loanDocuments = loanDocumentsArray;
    form.markModified("loanDocuments");
    await form.save();

    const updatedForm = await Form.findOne({ user: userId });
    console.log("9. Saved Form Loan Documents:", JSON.stringify(updatedForm.loanDocuments, null, 2));

    res.status(201).json({ message: "Loan documents saved successfully", data: updatedForm });
  } catch (error) {
    console.error("10. Error in saveLoanDocuments:", error);
    res.status(500).json({ message: "Failed to save loan documents", error: error.message });
  }
});

// ====================== Fetch All Forms ======================
const fetchAllForms = asyncHandler(async (req, res) => {
  try {
    const forms = await Form.find()
      .populate("user", "name email")
      .lean();

    if (!forms || forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No forms found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Forms fetched successfully",
      data: forms,
      total: forms.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch forms",
      error: error.message,
    });
  }
});

// ====================== Fetch Form by ID ======================
const fetchFormById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid form ID format" });
  }

  try {
    const form = await Form.findById(id).populate("user", "name email").lean();
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/`;
    const updatedLoanDocuments = form.loanDocuments.map((doc) => {
      const updatedDoc = {};
      for (const [key, value] of Object.entries(doc)) {
        updatedDoc[key] = value ? `${baseUrl}${value.split("/").pop()}` : null;
      }
      return updatedDoc;
    });

    const reorderedForm = {
      _id: form._id,
      user: form.user,
      personalDetails: form.personalDetails,
      loanApplication: form.loanApplication,
      loanDocuments: updatedLoanDocuments,
      status: form.status,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      __v: form.__v,
    };

    res.status(200).json({
      success: true,
      message: "Form fetched successfully",
      data: reorderedForm,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch form", error: error.message });
  }
});

// ====================== Update Form ======================
const updateForm = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid form ID format",
    });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Update data is required",
    });
  }

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    ).populate("user", "name email");

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update form",
      error: error.message,
    });
  }
});

// ====================== Delete Form ======================
const deleteForm = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid form ID format",
    });
  }

  try {
    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form deleted successfully",
      data: deletedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete form",
      error: error.message,
    });
  }
});

// ====================== Update Form Status ======================
const updateFormStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid form ID format",
    });
  }

  const validStatuses = ["Pending", "Approved", "In Progress", "Rejected"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Form status updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update form status",
      error: error.message,
    });
  }
});

// ====================== Get Forms by User ID ======================
const getFormsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log(`Fetching forms for user ID: ${userId}`);

  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }

  try {
    const forms = await Form.find({ user: userId }).lean();

    if (!forms || forms.length === 0) {
      console.log(`No forms found for user ID: ${userId}`);
      return res.status(200).json({
        success: true,
        data: [],
        message: "No forms found for this user",
      });
    }

    console.log(`Forms found for user ID: ${userId}`, forms);
    res.status(200).json({
      success: true,
      data: forms,
      message: "Forms fetched successfully",
    });
  } catch (error) {
    console.error(`Error fetching forms for user ID: ${userId}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = {
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
};