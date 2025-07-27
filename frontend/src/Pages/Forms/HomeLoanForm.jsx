import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contextapi/UserContext';
import { FaUser, FaBriefcase, FaHome, FaFileAlt, FaUsers, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CoApplicantManager from './steps/CoApplicantManager';
import CoApplicantFlow from './steps/CoApplicantFlow';

const HomeLoanForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [coApplicants, setCoApplicants] = useState([]);
  const [showCoApplicantFlow, setShowCoApplicantFlow] = useState(false);
  const [editingCoApplicantIndex, setEditingCoApplicantIndex] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Details & Address
    fullName: user?.name || '',
    fatherName: '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    dateOfBirth: '',
    gender: '',
    qualification: '',
    employmentType: '',
    maritalStatus: '',
    spouseEmploymentType: '',
    numberOfDependents: 0,
    panNumber: '',
    residenceType: '',
    citizenship: 'Indian',
    
    // Permanent Address
    permanentAddress: {
      state: '',
      district: '',
      address: '',
      pinCode: ''
    },
    
    // Present Address
    presentAddress: {
      state: '',
      district: '',
      address: '',
      pinCode: ''
    },
    
    // Step 2: Property & Loan Details
    propertyFinalised: false,
    propertyAddress: '',
    agreementExecuted: false,
    agreementValue: '',
    loanAmountRequired: '',
    preferredBanks: [],
    
    // Step 3: Employment Details
    // Salaried
    organisationName: '',
    organisationType: '',
    experienceCurrentOrg: '',
    experiencePreviousOrg: '',
    designation: '',
    placeOfPosting: '',
    monthlySalary: '',
    salaryBank: '',
    
    // Self-Employed/Professional
    firmName: '',
    firmType: '',
    firmRegistrationDate: '',
    businessDesignation: '',
    yearsInBusiness: '',
    yearsOfITRFiling: ''
  });

  const [documents, setDocuments] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Create application on component mount
  React.useEffect(() => {
    const createApplication = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/multistep/create', {
          userId: user._id,
          loanType: 'home'
        });
        
        if (response.data.success) {
          setApplicationId(response.data.data.applicationId);
        }
      } catch (error) {
        console.error('Error creating application:', error);
        toast.error('Failed to initialize application');
      }
    };

    if (user?._id && !applicationId) {
      createApplication();
    }
  }, [user, applicationId]);

  // Save step data
  const saveStepData = async (step, stepData) => {
    if (!applicationId) return;

    try {
      await axios.post('http://localhost:5000/api/multistep/save-step', {
        applicationId,
        step,
        stepData
      });
    } catch (error) {
      console.error('Error saving step data:', error);
      toast.error('Failed to save step data');
    }
  };

  // Navigation functions
  const nextStep = async () => {
    let stepData = {};
    
    switch (currentStep) {
      case 1:
        stepData = {
          fullName: formData.fullName,
          fatherName: formData.fatherName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          qualification: formData.qualification,
          employmentType: formData.employmentType,
          maritalStatus: formData.maritalStatus,
          spouseEmploymentType: formData.spouseEmploymentType,
          numberOfDependents: formData.numberOfDependents,
          panNumber: formData.panNumber,
          residenceType: formData.residenceType,
          citizenship: formData.citizenship,
          permanentAddress: formData.permanentAddress,
          presentAddress: formData.presentAddress
        };
        break;
      case 2:
        stepData = {
          propertyFinalised: formData.propertyFinalised,
          propertyAddress: formData.propertyAddress,
          agreementExecuted: formData.agreementExecuted,
          agreementValue: formData.agreementValue,
          loanAmountRequired: formData.loanAmountRequired,
          preferredBanks: formData.preferredBanks
        };
        break;
      case 3:
        if (formData.employmentType === 'Salaried') {
          stepData = {
            organisationName: formData.organisationName,
            organisationType: formData.organisationType,
            experienceCurrentOrg: formData.experienceCurrentOrg,
            experiencePreviousOrg: formData.experiencePreviousOrg,
            designation: formData.designation,
            placeOfPosting: formData.placeOfPosting,
            monthlySalary: formData.monthlySalary,
            salaryBank: formData.salaryBank
          };
        } else {
          stepData = {
            firmName: formData.firmName,
            firmType: formData.firmType,
            firmRegistrationDate: formData.firmRegistrationDate,
            businessDesignation: formData.businessDesignation,
            yearsInBusiness: formData.yearsInBusiness,
            yearsOfITRFiling: formData.yearsOfITRFiling
          };
        }
        break;
    }

    await saveStepData(currentStep, stepData);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Co-applicant handlers
  const handleAddCoApplicant = () => {
    setEditingCoApplicantIndex(null);
    setShowCoApplicantFlow(true);
  };

  const handleEditCoApplicant = (index) => {
    setEditingCoApplicantIndex(index);
    setShowCoApplicantFlow(true);
  };

  const handleRemoveCoApplicant = (index) => {
    setCoApplicants(prev => prev.filter((_, i) => i !== index));
  };

  const handleCoApplicantComplete = (coApplicantData) => {
    if (editingCoApplicantIndex !== null) {
      setCoApplicants(prev => prev.map((ca, index) => 
        index === editingCoApplicantIndex ? coApplicantData : ca
      ));
    } else {
      setCoApplicants(prev => [...prev, coApplicantData]);
    }
    setShowCoApplicantFlow(false);
    setEditingCoApplicantIndex(null);
  };

  const handleCoApplicantCancel = () => {
    setShowCoApplicantFlow(false);
    setEditingCoApplicantIndex(null);
  };

  const handleFinishApplication = async () => {
    setIsSubmitting(true);
    try {
      // Save co-applicants data
      await saveStepData(5, { coApplicants });
      
      // Submit application
      const response = await axios.post('http://localhost:5000/api/multistep/submit', {
        applicationId
      });

      if (response.data.success) {
        toast.success('Home loan application submitted successfully!');
        navigate('/user/applications');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Document upload handler
  const handleDocumentUpload = async (documentType, file) => {
    if (!file || !applicationId) return;

    setUploadingFiles(prev => ({ ...prev, [documentType]: true }));

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', documentType);
      formData.append('applicantType', 'main');

      const response = await axios.post('http://localhost:5000/api/multistep/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setDocuments(prev => ({
          ...prev,
          [documentType]: {
            fileName: response.data.data.fileName,
            fileUrl: response.data.data.fileUrl
          }
        }));
        toast.success(`${documentType} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`Failed to upload ${documentType}`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [documentType]: false }));
    }
  };

  // Render step content
  const renderPersonalDetailsAndAddress = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Personal Details & Address</h2>
        <p className="text-gray-300">Please provide your personal information and address details</p>
      </div>

      {/* Personal Details */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Full Name as per PAN Card *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Father Name *
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              10-digit Mobile Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Email ID *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Qualification *
            </label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Qualification</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Professional">Professional</option>
              <option value="Others">Others</option>
            </select>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Marital Status *
            </label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {formData.maritalStatus === 'Married' && (
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Spouse Employment Type
              </label>
              <select
                name="spouseEmploymentType"
                value={formData.spouseEmploymentType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Spouse Employment</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Professional">Professional</option>
                <option value="Business">Business</option>
                <option value="Housewife">Housewife</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Number of Dependents *
            </label>
            <select
              name="numberOfDependents"
              value={formData.numberOfDependents}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              PAN Number *
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="ABCDE1234F"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Residence Type *
            </label>
            <select
              name="residenceType"
              value={formData.residenceType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Residence Type</option>
              <option value="Owned">Owned</option>
              <option value="Rented">Rented</option>
              <option value="Parental">Parental</option>
              <option value="Company Provided">Company Provided</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Citizenship *
            </label>
            <select
              name="citizenship"
              value={formData.citizenship}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Indian">Indian</option>
              <option value="NRI">NRI</option>
              <option value="Foreign National">Foreign National</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Permanent Address */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Permanent Address</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">State *</label>
              <input
                type="text"
                name="permanentAddress.state"
                value={formData.permanentAddress.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">District *</label>
              <input
                type="text"
                name="permanentAddress.district"
                value={formData.permanentAddress.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Complete Address *</label>
              <textarea
                name="permanentAddress.address"
                value={formData.permanentAddress.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Pin Code *</label>
              <input
                type="text"
                name="permanentAddress.pinCode"
                value={formData.permanentAddress.pinCode}
                onChange={handleInputChange}
                pattern="[0-9]{6}"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Present Address */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Present Address</h3>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  presentAddress: { ...prev.permanentAddress }
                }));
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Same as Permanent
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">State *</label>
              <input
                type="text"
                name="presentAddress.state"
                value={formData.presentAddress.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">District *</label>
              <input
                type="text"
                name="presentAddress.district"
                value={formData.presentAddress.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Complete Address *</label>
              <textarea
                name="presentAddress.address"
                value={formData.presentAddress.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">Pin Code *</label>
              <input
                type="text"
                name="presentAddress.pinCode"
                value={formData.presentAddress.pinCode}
                onChange={handleInputChange}
                pattern="[0-9]{6}"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPropertyAndLoanDetails = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Property & Loan Details</h2>
        <p className="text-gray-300">Please provide property and loan information</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Property Finalised *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="propertyFinalised"
                  value="true"
                  checked={formData.propertyFinalised === true}
                  onChange={() => handleInputChange({
                    target: { name: 'propertyFinalised', value: true, type: 'radio' }
                  })}
                  className="mr-2 text-blue-500"
                />
                <span className="text-white">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="propertyFinalised"
                  value="false"
                  checked={formData.propertyFinalised === false}
                  onChange={() => handleInputChange({
                    target: { name: 'propertyFinalised', value: false, type: 'radio' }
                  })}
                  className="mr-2 text-blue-500"
                />
                <span className="text-white">No</span>
              </label>
            </div>
          </div>

          {formData.propertyFinalised && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Property Address
              </label>
              <textarea
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Agreement/MoU Executed *
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agreementExecuted"
                  value="true"
                  checked={formData.agreementExecuted === true}
                  onChange={() => handleInputChange({
                    target: { name: 'agreementExecuted', value: true, type: 'radio' }
                  })}
                  className="mr-2 text-blue-500"
                />
                <span className="text-white">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="agreementExecuted"
                  value="false"
                  checked={formData.agreementExecuted === false}
                  onChange={() => handleInputChange({
                    target: { name: 'agreementExecuted', value: false, type: 'radio' }
                  })}
                  className="mr-2 text-blue-500"
                />
                <span className="text-white">No</span>
              </label>
            </div>
          </div>

          {formData.agreementExecuted && (
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Agreement/MoU Value (Rs.)
              </label>
              <input
                type="number"
                name="agreementValue"
                value={formData.agreementValue}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Loan Amount Required *
            </label>
            <div className="space-y-4">
              {/* Amount Display */}
              <div className="text-center">
                <span className="text-2xl font-bold text-white">
                  ₹ {formData.loanAmountRequired ? 
                    (parseInt(formData.loanAmountRequired) >= 10000000 ? 
                      (parseInt(formData.loanAmountRequired) / 10000000).toFixed(1) + ' Crore' : 
                      (parseInt(formData.loanAmountRequired) / 100000).toFixed(1) + ' Lakh') : 
                    '1.0 Lakh'}
                </span>
                <p className="text-gray-300 text-sm mt-1">
                  Range: ₹1 Lakh to ₹5 Crore
                </p>
              </div>
              
                            {/* Slider */}
              <div className="relative px-2">
                <input
                  type="range"
                  name="loanAmountRequired"
                  min="100000"
                  max="50000000"
                  step="50000"
                  value={formData.loanAmountRequired || 100000}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #1D4ED8 ${((formData.loanAmountRequired || 100000) - 100000) / (50000000 - 100000) * 100}%, rgba(255,255,255,0.2) ${((formData.loanAmountRequired || 100000) - 100000) / (50000000 - 100000) * 100}%)`
                  }}
                  required
                />
                
                {/* Range markers */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>₹1L</span>
                  <span>₹1Cr</span>
                  <span>₹2Cr</span>
                  <span>₹3Cr</span>
                  <span>₹5Cr</span>
                </div>
              </div>
              
              {/* Manual Input Option */}
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">Or enter manually:</span>
                <input
                  type="number"
                  name="loanAmountRequired"
                  value={formData.loanAmountRequired}
                  onChange={handleInputChange}
                  placeholder="Amount in Rs."
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Preferred Banks
            </label>
            <input
              type="text"
              name="preferredBanks"
              value={formData.preferredBanks.join(', ')}
              onChange={(e) => handleInputChange({
                target: { 
                  name: 'preferredBanks', 
                  value: e.target.value.split(', ').filter(bank => bank.trim()),
                  type: 'text'
                }
              })}
              placeholder="Enter bank names separated by commas"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Employment Details - Applicant 1</h2>
        <p className="text-gray-300">Please provide your employment information</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        {/* Employment Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Employment Type *</h3>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="employmentType"
                value="Salaried"
                checked={formData.employmentType === 'Salaried'}
                onChange={handleInputChange}
                className="mr-2 text-blue-500"
              />
              <span className="text-white">Salaried</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="employmentType"
                value="Self-Employed"
                checked={formData.employmentType === 'Self-Employed'}
                onChange={handleInputChange}
                className="mr-2 text-blue-500"
              />
              <span className="text-white">Self-Employed / Professional</span>
            </label>
          </div>
        </div>
        {formData.employmentType === 'Salaried' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Salaried Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Organisation Name *
                </label>
                <input
                  type="text"
                  name="organisationName"
                  value={formData.organisationName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Organisation Type *
                </label>
                <select
                  name="organisationType"
                  value={formData.organisationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Organisation Type</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Public Sector">Public Sector</option>
                  <option value="MNC">MNC</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Experience in Current Organization (Years)
                </label>
                <input
                  type="number"
                  name="experienceCurrentOrg"
                  value={formData.experienceCurrentOrg}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Experience in Previous Organization (Years)
                </label>
                <input
                  type="number"
                  name="experiencePreviousOrg"
                  value={formData.experiencePreviousOrg}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Place of Posting
                </label>
                <input
                  type="text"
                  name="placeOfPosting"
                  value={formData.placeOfPosting}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Monthly Salary (in hand)
                </label>
                <input
                  type="number"
                  name="monthlySalary"
                  value={formData.monthlySalary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Bank in which salary account is maintained
                </label>
                <input
                  type="text"
                  name="salaryBank"
                  value={formData.salaryBank}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Self-Employed / Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Name of Firm/Company *
                </label>
                <input
                  type="text"
                  name="firmName"
                  value={formData.firmName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Type of Firm *
                </label>
                <select
                  name="firmType"
                  value={formData.firmType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Firm Type</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="LLP">LLP</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Firm Registration / Incorporation Date
                </label>
                <input
                  type="date"
                  name="firmRegistrationDate"
                  value={formData.firmRegistrationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Designation *
                </label>
                <select
                  name="businessDesignation"
                  value={formData.businessDesignation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Proprietor">Proprietor</option>
                  <option value="Partner">Partner</option>
                  <option value="Director">Director</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Years in Line of Business (VINTAGE)
                </label>
                <input
                  type="number"
                  name="yearsInBusiness"
                  value={formData.yearsInBusiness}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Years of ITR Filing (VINTAGE)
                </label>
                <input
                  type="number"
                  name="yearsOfITRFiling"
                  value={formData.yearsOfITRFiling}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocuments = () => {
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

    const documentsToShow = formData.employmentType === 'Salaried' ? salariedDocs : selfEmployedDocs;

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Document Upload - HOME LOAN APPLICATION</h2>
          <p className="text-gray-300">Please upload the required documents</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="space-y-6">
            {documentsToShow.map((doc, index) => (
              <div key={doc.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center space-x-4">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-white">{doc.label}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {documents[doc.key] ? (
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-green-400" />
                      <span className="text-green-400 text-sm">{documents[doc.key].fileName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
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
                      <span className="text-gray-400 text-sm">Drag & drop or select file</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCoApplicantStep = () => {
    if (showCoApplicantFlow) {
      return (
        <CoApplicantFlow
          onComplete={handleCoApplicantComplete}
          onCancel={handleCoApplicantCancel}
          existingData={editingCoApplicantIndex !== null ? coApplicants[editingCoApplicantIndex] : null}
          title={editingCoApplicantIndex !== null ? "Edit Co-Applicant" : "Add Co-Applicant"}
          loanType="home"
        />
      );
    }

    return (
      <CoApplicantManager
        coApplicants={coApplicants}
        onAddCoApplicant={handleAddCoApplicant}
        onFinish={handleFinishApplication}
        onBack={prevStep}
        loanType="Home Loan"
        onEditCoApplicant={handleEditCoApplicant}
        onRemoveCoApplicant={handleRemoveCoApplicant}
        isSubmitting={isSubmitting}
      />
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetailsAndAddress();
      case 2:
        return renderPropertyAndLoanDetails();
      case 3:
        return renderEmploymentDetails();
      case 4:
        return renderDocuments();
      case 5:
        return renderCoApplicantStep();
      default:
        return renderPersonalDetailsAndAddress();
    }
  };

  const steps = [
    { number: 1, title: 'Personal Details & Address', icon: FaUser },
    { number: 2, title: 'Property & Loan Details', icon: FaHome },
    { number: 3, title: 'Employment Details', icon: FaBriefcase },
    { number: 4, title: 'Documents', icon: FaFileAlt },
    { number: 5, title: 'Co-Applicant', icon: FaUsers }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/3 w-24 h-24 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Home Loan{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Application
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete your home loan application in simple steps. Our team will review and get back to you within 24 hours.
            </p>
          </div>

          {/* Modern Step Indicators */}
          {!showCoApplicantFlow && (
            <div className="mb-12">
              <div className="flex justify-center">
                <div className="flex items-center space-x-8">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                          currentStep > step.number 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/25' 
                            : currentStep === step.number 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 scale-110' 
                            : 'bg-white/10 border-2 border-white/20'
                        }`}>
                          {currentStep > step.number ? (
                            <FaCheck className="w-6 h-6 text-white" />
                          ) : (
                            <step.icon className={`w-6 h-6 ${
                              currentStep === step.number ? 'text-white' : 'text-gray-400'
                            }`} />
                          )}
                          
                          {currentStep === step.number && (
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="mt-3 text-center">
                          <div className={`text-sm font-medium ${
                            currentStep === step.number ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            Step {step.number}
                          </div>
                          <div className={`text-xs ${
                            currentStep === step.number ? 'text-white' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </div>
                        </div>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={`w-24 h-0.5 mx-4 ${
                          currentStep > step.number ? 'bg-green-500' : 'bg-white/20'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            {currentStep === 5 ? (
              renderStepContent()
            ) : (
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/20">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      currentStep === 1
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-white/10 text-white hover:bg-white/20 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Step {currentStep} of {steps.length}</span>
                  </div>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <span>Next</span>
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoanForm; 