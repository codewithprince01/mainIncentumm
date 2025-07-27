const mongoose = require("mongoose");

const personalDetailsSchema = new mongoose.Schema(
  {
    full_name: { type: String },
    father_name: { type: String },
    mobile_number: { type: String, match: /^[0-9]{10}$/ },
    email_id: {
      type: String,
      match: /\S+@\S+\.\S+/,
    },
    dob: { type: String },
    gender: { type: String },
    qualification: { type: String },
    employment_type: { type: String },
    marital_status: { type: String },
    spouse_employment_type: { type: String },
    no_of_dependents: { type: Number },
    pan_number: { type: String },
    residence_type: { type: String },
    citizenship: { type: String },

    // Permanent Address
    permanent_state: { type: String },
    permanent_district: { type: String },
    permanent_address: { type: String },
    permanent_pincode: { type: String, match: /^[0-9]{6}$/ },

    // Present Address
    present_state: { type: String },
    present_district: { type: String },
    present_address: { type: String },
    present_pincode: { type: String, match: /^[0-9]{6}$/ },
  },
  { _id: false }
);

const salariedDetailsSchema = new mongoose.Schema(
  {
    organisation_name: { type: String },
    organisation_type: { type: String },
    currentOrganizationExperience: { type: String },
    previousOrganizationExperience: { type: String },
    designation_salaried: { type: String },
    place_of_posting: { type: String },
    monthly_salary: { type: Number },
    salary_bank_name: { type: String },
  },
  { _id: false }
);

const selfEmployedDetailsSchema = new mongoose.Schema(
  {
    company_name: { type: String },
    company_type: { type: String },
    incorporation_date: { type: String }, // Changed to String to match frontend input
    designation_self: { type: String },
    years_in_business: { type: String }, // Changed to String to match frontend input
    years_of_itr_filing: { type: String }, // Changed to String to match frontend input
  },
  { _id: false }
);

const applicantDetailsSchema = new mongoose.Schema(
  {
    user_type: { type: String, enum: ["Salaried", "Self-Employed"] },
    salariedDetails: { type: salariedDetailsSchema, default: null },
    selfEmployedDetails: { type: selfEmployedDetailsSchema, default: null },
  },
  { _id: false }
);

const loanApplicationSchema = new mongoose.Schema(
  {
    loanType: {
      type: String,
      enum: [
        "Home Loan",
        "Vehicle Loan",
        "Business Loan",
        "Personal Loan",
        "Mortgage Loan",
      ],
    },
    applicants: [applicantDetailsSchema], // Array to store details for multiple applicants
    property_finalised: { type: String },
    property_address: { type: String },
    agreement_executed: { type: String },
    agreement_mou_value: { type: String }, // Changed to String to match frontend input
    loan_amount_required: { type: String }, // Changed to String to match frontend input
    preferred_banks: { type: String },
    // vehicleDetails: {
    //   type: new mongoose.Schema({
    //     vehicleModel: { type: String },
    //     expectedDeliveryDate: { type: String },
    //     dealerName: { type: String },
    //     dealerCity: { type: String },
    //     vehiclePrice: { type: String }, // Changed to String to match frontend input
    //   }, { _id: false }),
    //   default: null,
    // },
  },
  { _id: false }
);

const loanDocumentsSchema = new mongoose.Schema(
  {
    panCard: { type: String },
    aadharCard: { type: String },
    employerIDCard: { type: String },
    joiningConfirmationExperienceLetter: { type: String },
    last12MonthSalaryAccountStatement: { type: String },
    last12MonthSavingsBankAccountStatement: { type: String },
    existingLoanAccountStatement: { type: String },
    latest6MonthSalarySlip: { type: String },
    form16PartABAnd26AS: { type: String },
    itrAndComputation: { type: String },
    firmRegistrationCertificate: { type: String },
    gstrLastYear: { type: String },
    last6Or12MonthCurrentAccountStatement: { type: String },
    balanceSheets: { type: String },
    nocLoanCloseStatements: { type: String },
    drivingLicense: { type: String },
    kycProprietorPartnersDirectors: { type: String },
    certificateForIncorporation: { type: String },
    articleOfAssociation: { type: String },
    memorandumOfAssociation: { type: String },
    businessAccountStatement: { type: String },
    otherRelevantDocuments: { type: String },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personalDetails: [personalDetailsSchema],
    loanApplication: loanApplicationSchema,
    loanDocuments: [loanDocumentsSchema],
    status: {
      type: String,
      enum: ["Pending", "Approved","In Progress", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
