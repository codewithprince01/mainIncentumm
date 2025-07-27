import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaBriefcase, FaFileAlt, FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';

const CoApplicantFlow = ({ onComplete, onCancel, existingData = null, title = "Add Co-Applicant", loanType = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [coApplicantData, setCoApplicantData] = useState({
    relationship: existingData?.relationship || '',
    personalDetails: existingData?.personalDetails || {
      full_name: '',
      father_name: '',
      email_id: '',
      mobile_number: '',
      dob: '',
      gender: '',
      qualification: '',
      marital_status: '',
      pan_number: '',
      residence_type: '',
      permanent_address: '',
      permanent_pincode: '',
      present_address: '',
      present_pincode: ''
    },
    employmentDetails: existingData?.employmentDetails || {
      employment_type: '',
      organisation_name: '',
      organisation_type: '',
      designation_salaried: '',
      currentOrganizationExperience: '',
      previousOrganizationExperience: '',
      monthly_salary: '',
      place_of_posting: '',
      salary_bank_name: '',
      company_name: '',
      company_type: '',
      incorporation_date: '',
      designation_self: '',
      years_in_business: '',
      years_of_itr_filing: '',
      annual_income: '',
      business_address: ''
    },
    documents: existingData?.documents || {
      panCard: null,
      aadharCard: null,
      employerIdCard: null,
      experienceLetter: null,
      salaryAccountStatement: null,
      existingLoanStatement: null,
      salarySlip: null,
      form16: null,
      itr: null,
      firmRegistration: null,
      gstr: null,
      currentAccountStatement: null,
      savingsAccountStatement: null,
      balanceSheet: null,
      nocLoanClosure: null
    }
  });

  const [uploadingFiles, setUploadingFiles] = useState({});

  const steps = [
    { number: 1, title: 'Personal Details', icon: FaUser },
    { number: 2, title: 'Employment Details', icon: FaBriefcase },
    { number: 3, title: 'Documents', icon: FaFileAlt }
  ];

  const handleDataChange = (newData) => {
    setCoApplicantData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleRelationshipChange = (relationship) => {
    setCoApplicantData(prev => ({
      ...prev,
      relationship
    }));
  };

  const handleCoApplicantCancel = () => {
    onCancel();
  };

  // Document upload handler for co-applicant
  const handleDocumentUpload = async (documentType, file) => {
    if (!file) return;

    setUploadingFiles(prev => ({ ...prev, [documentType]: true }));

    try {
      // Store the file object in the co-applicant documents
      setCoApplicantData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: {
            file: file,
            fileName: file.name,
            uploadedAt: new Date().toISOString()
          }
        }
      }));

      console.log(`Co-applicant ${documentType} uploaded successfully`);
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const validateCurrentStep = () => {
    const errors = [];
    
    switch (currentStep) {
      case 1:
        // Personal Details - Only name and phone number required for co-applicants
        if (!coApplicantData.personalDetails?.full_name?.trim()) {
          errors.push('Full Name is required');
        }
        if (!coApplicantData.personalDetails?.mobile_number?.trim()) {
          errors.push('Mobile Number is required');
        }
        break;
        
      case 2:
        // Employment Details - Optional for co-applicants
        // No validation required, all fields are optional
        break;
        
      // Documents step (step 3) is optional, so no validation needed
    }
    
    if (errors.length > 0) {
      const errorMessage = `Please fix the following issues:\n\n${errors.map((error, index) => `${index + 1}. ${error}`).join('\n')}`;
      alert(errorMessage);
      return false;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(coApplicantData);
  };

  // White input styles for better visibility
  const inputStyle = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelStyle = "block text-sm font-medium text-white mb-2";
  const selectStyle = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  const renderRelationshipSelector = () => (
    <div className="mb-6">
      <label className={labelStyle}>
        Relationship to Main Applicant
      </label>
      <select
        value={coApplicantData.relationship}
        onChange={(e) => handleRelationshipChange(e.target.value)}
        className={selectStyle}
      >
        <option value="">Select Relationship</option>
        <option value="spouse">Spouse</option>
        <option value="father">Father</option>
        <option value="mother">Mother</option>
        <option value="son">Son</option>
        <option value="daughter">Daughter</option>
        <option value="brother">Brother</option>
        <option value="sister">Sister</option>
        <option value="father_in_law">Father-in-law</option>
        <option value="mother_in_law">Mother-in-law</option>
        <option value="brother_in_law">Brother-in-law</option>
        <option value="sister_in_law">Sister-in-law</option>
        <option value="friend">Friend</option>
        <option value="business_partner">Business Partner</option>
        <option value="other">Other</option>
      </select>
    </div>
  );

  const renderPersonalDetailsStep = () => (
    <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={coApplicantData.personalDetails.full_name}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                full_name: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
                        <label className={labelStyle}>Father&apos;s Name</label>
          <input
            type="text"
            value={coApplicantData.personalDetails.father_name}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                father_name: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter father's name"
          />
        </div>

        <div>
          <label className={labelStyle}>Email Address</label>
          <input
            type="email"
            value={coApplicantData.personalDetails.email_id}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                email_id: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className={labelStyle}>Mobile Number *</label>
          <input
            type="tel"
            value={coApplicantData.personalDetails.mobile_number}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                mobile_number: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter mobile number"
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Date of Birth</label>
          <input
            type="date"
            value={coApplicantData.personalDetails.dob}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                dob: e.target.value
              }
            })}
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>Gender</label>
          <select
            value={coApplicantData.personalDetails.gender}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                gender: e.target.value
              }
            })}
            className={selectStyle}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Marital Status</label>
          <select
            value={coApplicantData.personalDetails.marital_status}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                marital_status: e.target.value
              }
            })}
            className={selectStyle}
          >
            <option value="">Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>PAN Number</label>
          <input
            type="text"
            value={coApplicantData.personalDetails.pan_number}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                pan_number: e.target.value.toUpperCase()
              }
            })}
            className={inputStyle}
            placeholder="Enter PAN number"
            maxLength={10}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelStyle}>Permanent Address</label>
          <textarea
            value={coApplicantData.personalDetails.permanent_address}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                permanent_address: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter permanent address"
            rows={3}
          />
        </div>

        <div>
          <label className={labelStyle}>Permanent Pincode</label>
          <input
            type="text"
            value={coApplicantData.personalDetails.permanent_pincode}
            onChange={(e) => handleDataChange({
              personalDetails: {
                ...coApplicantData.personalDetails,
                permanent_pincode: e.target.value
              }
            })}
            className={inputStyle}
            placeholder="Enter pincode"
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetailsStep = () => (
    <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Employment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelStyle}>Employment Type</label>
          <select
            value={coApplicantData.employmentDetails.employment_type}
            onChange={(e) => handleDataChange({
              employmentDetails: {
                ...coApplicantData.employmentDetails,
                employment_type: e.target.value
              }
            })}
            className={selectStyle}
          >
            <option value="">Select Employment Type</option>
            <option value="Salaried">Salaried</option>
            <option value="Self-Employed">Self-Employed</option>
          </select>
        </div>

        {coApplicantData.employmentDetails.employment_type === 'Salaried' && (
          <>
            <div>
              <label className={labelStyle}>Organization Name</label>
              <input
                type="text"
                value={coApplicantData.employmentDetails.organisation_name}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    organisation_name: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className={labelStyle}>Designation</label>
              <input
                type="text"
                value={coApplicantData.employmentDetails.designation_salaried}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    designation_salaried: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter designation"
              />
            </div>

            <div>
              <label className={labelStyle}>Monthly Salary (₹)</label>
              <input
                type="number"
                value={coApplicantData.employmentDetails.monthly_salary}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    monthly_salary: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter monthly salary"
                min="0"
              />
            </div>

            <div>
              <label className={labelStyle}>Place of Posting</label>
              <input
                type="text"
                value={coApplicantData.employmentDetails.place_of_posting}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    place_of_posting: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter place of posting"
              />
            </div>
          </>
        )}

        {coApplicantData.employmentDetails.employment_type === 'Self-Employed' && (
          <>
            <div>
              <label className={labelStyle}>Company/Business Name</label>
              <input
                type="text"
                value={coApplicantData.employmentDetails.company_name}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    company_name: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter company/business name"
              />
            </div>

            <div>
              <label className={labelStyle}>Designation/Role</label>
              <input
                type="text"
                value={coApplicantData.employmentDetails.designation_self}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    designation_self: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter designation/role"
              />
            </div>

            <div>
              <label className={labelStyle}>Annual Income (₹)</label>
              <input
                type="number"
                value={coApplicantData.employmentDetails.annual_income}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    annual_income: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter annual income"
                min="0"
              />
            </div>

            <div>
              <label className={labelStyle}>Business Address</label>
              <textarea
                value={coApplicantData.employmentDetails.business_address}
                onChange={(e) => handleDataChange({
                  employmentDetails: {
                    ...coApplicantData.employmentDetails,
                    business_address: e.target.value
                  }
                })}
                className={inputStyle}
                placeholder="Enter business address"
                rows={3}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderDocumentsStep = () => {
    const salariedDocs = [
      { key: 'panCard', label: 'PAN Card' },
      { key: 'aadharCard', label: 'Aadhar Card' },
      { key: 'employerIdCard', label: 'Employer ID Card' },
      { key: 'experienceLetter', label: 'Joining/Confirmation/Experience Letter' },
      { key: 'salaryAccountStatement', label: 'Last 12 Month Salary Account Statement' },
      { key: 'existingLoanStatement', label: 'Existing Loan Account Statement' },
      { key: 'salarySlip', label: 'Latest 6 Month Salary Slip' },
      { key: 'form16', label: '2/3 years Form 16 (Part A & B) and 26 AS' },
      { key: 'itr', label: '2/3 years ITR and Computation' }
    ];

    const selfEmployedDocs = [
      { key: 'panCard', label: 'PAN Card' },
      { key: 'aadharCard', label: 'Aadhar Card' },
      { key: 'firmRegistration', label: 'Firm Registration Certificate' },
      { key: 'gstr', label: 'GSTR for Last Year' },
      { key: 'currentAccountStatement', label: 'Last 6 or 12 Month Current Account Statement' },
      { key: 'savingsAccountStatement', label: 'Last 12 Month Savings Bank Account Statement' },
      { key: 'existingLoanStatement', label: 'Existing Loan Account Statement' },
      { key: 'itr', label: '2/3 years ITR and Computation' },
      { key: 'balanceSheet', label: '2/3 years Balance Sheets' },
      { key: 'nocLoanClosure', label: 'NOC / Loan Closure Statements for loans closed in 1 year' }
    ];

    const documentsToShow = coApplicantData.employmentDetails.employment_type === 'salaried' ? salariedDocs : selfEmployedDocs;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white mb-4">Document Upload - Co-Applicant</h3>
        <p className="text-white mb-6">
          Please upload the required documents for the co-applicant based on their employment type
        </p>
        
        <div className="space-y-4">
          {documentsToShow.map((doc, index) => (
            <div key={doc.key} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-white">{doc.label}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  {coApplicantData.documents[doc.key] ? (
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-green-600 text-sm">{coApplicantData.documents[doc.key].fileName}</span>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      {uploadingFiles[doc.key] ? 'Uploading...' : 'Choose File'}
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleDocumentUpload(doc.key, e.target.files[0]);
                          }
                        }}
                        disabled={uploadingFiles[doc.key]}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Document Guidelines</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Please ensure all documents are clear and readable</li>
            <li>• Accepted formats: PDF, JPG, JPEG, PNG, DOC, DOCX</li>
            <li>• Maximum file size: 10MB per document</li>
            <li>• Documents will be verified by our team</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {renderRelationshipSelector()}
            {renderPersonalDetailsStep()}
          </div>
        );
      case 2:
        return renderEmploymentDetailsStep();
      case 3:
        return renderDocumentsStep();
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {title}
        </h2>
        <p className="text-white">
          Please fill in the co-applicant&apos;s information for your {title.toLowerCase().replace('add', '').replace('edit', '').replace('co-applicant', '').replace('details', '')}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/25' 
                      : currentStep === step.number 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 scale-110' 
                      : 'bg-gray-200 border-2 border-gray-300'
                  }`}>
                    {currentStep > step.number ? (
                      <FaCheck className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${
                        currentStep === step.number ? 'text-white' : 'text-gray-500'
                      }`} />
                    )}
                    
                    {currentStep === step.number && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${
                      currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleCoApplicantCancel}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
                      <FaTimes className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Step {currentStep} of {steps.length}</span>
        </div>

        <div className="flex space-x-4">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              <span>Next</span>
              <FaArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              <span>{title.includes('Edit') ? 'Update' : 'Add'} Co-Applicant</span>
              <FaCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CoApplicantFlow; 