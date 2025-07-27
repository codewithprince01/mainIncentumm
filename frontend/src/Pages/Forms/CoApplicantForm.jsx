import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaBriefcase, FaPlus, FaCheck, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const CoApplicantForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationId, loanDetails } = location.state || {};
  
  const [currentStep, setCurrentStep] = useState(1);
  const [coApplicants, setCoApplicants] = useState([]);
  const [currentCoApplicant, setCurrentCoApplicant] = useState({
    relationship: '',
    personalDetails: {
      fullName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',
      panNumber: '',
      aadharNumber: '',
      address: ''
    },
    employmentDetails: {
      employmentType: '',
      companyName: '',
      designation: '',
      monthlyIncome: '',
      workExperience: ''
    }
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section, field, value) => {
    setCurrentCoApplicant(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDirectChange = (field, value) => {
    setCurrentCoApplicant(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCoApplicant = () => {
    if (!currentCoApplicant.personalDetails.fullName || !currentCoApplicant.relationship) {
      toast.error('Please fill in the required fields (Name and Relationship)');
      return;
    }

    setCoApplicants(prev => [...prev, { ...currentCoApplicant }]);
    setCurrentCoApplicant({
      relationship: '',
      personalDetails: {
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        panNumber: '',
        aadharNumber: '',
        address: ''
      },
      employmentDetails: {
        employmentType: '',
        companyName: '',
        designation: '',
        monthlyIncome: '',
        workExperience: ''
      }
    });
    setShowAddForm(false);
    toast.success('Co-applicant added successfully!');
  };

  const removeCoApplicant = (index) => {
    setCoApplicants(prev => prev.filter((_, i) => i !== index));
    toast.success('Co-applicant removed');
  };

  const submitCoApplicants = async () => {
    if (coApplicants.length === 0) {
      // No co-applicants to add, just proceed
      navigate('/dashboard');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`/api/loan-applications/${applicationId}`, {
        coApplicants: coApplicants
      }, {
        withCredentials: true
      });
      
      toast.success('Co-applicants added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding co-applicants:', error);
      toast.error('Failed to add co-applicants. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipCoApplicants = () => {
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Relationship to Main Applicant *
          </label>
          <select
            value={currentCoApplicant.relationship}
            onChange={(e) => handleDirectChange('relationship', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select Relationship</option>
            <option value="spouse">Spouse</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="son">Son</option>
            <option value="daughter">Daughter</option>
            <option value="brother">Brother</option>
            <option value="sister">Sister</option>
            <option value="friend">Friend</option>
            <option value="business_partner">Business Partner</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={currentCoApplicant.personalDetails.fullName}
            onChange={(e) => handleInputChange('personalDetails', 'fullName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={currentCoApplicant.personalDetails.dateOfBirth}
            onChange={(e) => handleInputChange('personalDetails', 'dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={currentCoApplicant.personalDetails.phoneNumber}
            onChange={(e) => handleInputChange('personalDetails', 'phoneNumber', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={currentCoApplicant.personalDetails.email}
            onChange={(e) => handleInputChange('personalDetails', 'email', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            PAN Number
          </label>
          <input
            type="text"
            value={currentCoApplicant.personalDetails.panNumber}
            onChange={(e) => handleInputChange('personalDetails', 'panNumber', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter PAN number"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aadhar Number
          </label>
          <input
            type="text"
            value={currentCoApplicant.personalDetails.aadharNumber}
            onChange={(e) => handleInputChange('personalDetails', 'aadharNumber', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter Aadhar number"
            maxLength={12}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address
          </label>
          <textarea
            value={currentCoApplicant.personalDetails.address}
            onChange={(e) => handleInputChange('personalDetails', 'address', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter complete address"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Employment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Employment Type
          </label>
          <select
            value={currentCoApplicant.employmentDetails.employmentType}
            onChange={(e) => handleInputChange('employmentDetails', 'employmentType', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="">Select Employment Type</option>
            <option value="salaried">Salaried</option>
            <option value="self_employed">Self Employed</option>
            <option value="business">Business</option>
            <option value="unemployed">Unemployed</option>
            <option value="retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company/Business Name
          </label>
          <input
            type="text"
            value={currentCoApplicant.employmentDetails.companyName}
            onChange={(e) => handleInputChange('employmentDetails', 'companyName', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter company/business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Designation/Position
          </label>
          <input
            type="text"
            value={currentCoApplicant.employmentDetails.designation}
            onChange={(e) => handleInputChange('employmentDetails', 'designation', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter designation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            value={currentCoApplicant.employmentDetails.monthlyIncome}
            onChange={(e) => handleInputChange('employmentDetails', 'monthlyIncome', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter monthly income"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Work Experience (Years)
          </label>
          <input
            type="number"
            value={currentCoApplicant.employmentDetails.workExperience}
            onChange={(e) => handleInputChange('employmentDetails', 'workExperience', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter work experience"
            min="0"
          />
        </div>
      </div>
    </div>
  );

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Invalid Access</h2>
          <p className="mb-4">No application found. Please submit a loan application first.</p>
          <button
            onClick={() => navigate('/loan-application')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Apply for Loan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Add Co-Applicants
          </h1>
          <p className="text-gray-300 text-lg">
            Adding co-applicants can strengthen your loan application
          </p>
          {loanDetails && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <p className="text-white">
                <span className="font-semibold">Loan Type:</span> {loanDetails.loanType} | 
                <span className="font-semibold"> Amount:</span> ₹{loanDetails.loanAmount?.toLocaleString()} |
                <span className="font-semibold"> Application ID:</span> {applicationId}
              </p>
            </div>
          )}
        </div>

        {/* Co-Applicants List */}
        {coApplicants.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Added Co-Applicants</h2>
            <div className="space-y-4">
              {coApplicants.map((coApplicant, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">
                        {coApplicant.personalDetails.fullName}
                      </h3>
                      <p className="text-gray-400">
                        Relationship: {coApplicant.relationship.replace('_', ' ').toUpperCase()}
                      </p>
                      {coApplicant.personalDetails.phoneNumber && (
                        <p className="text-gray-400">Phone: {coApplicant.personalDetails.phoneNumber}</p>
                      )}
                      {coApplicant.employmentDetails.monthlyIncome && (
                        <p className="text-gray-400">
                          Monthly Income: ₹{parseInt(coApplicant.employmentDetails.monthlyIncome).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeCoApplicant(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Remove Co-Applicant"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Co-Applicant Form */}
        {showAddForm ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-slate-700 shadow-2xl mb-8">
            {/* Step Indicators */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Personal</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    <FaBriefcase className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Employment</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            {currentStep === 1 && renderPersonalDetails()}
            {currentStep === 2 && renderEmploymentDetails()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FaTimes className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}

                {currentStep < 2 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <span>Next</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={addCoApplicant}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add Co-Applicant</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Add Co-Applicant Button */
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
            >
              <FaPlus className="w-5 h-5" />
              <span>Add Co-Applicant</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={skipCoApplicants}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <span>Skip Co-Applicants</span>
          </button>

          <button
            onClick={submitCoApplicants}
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-2 px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" />
                <span>Complete Application</span>
              </>
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Co-applicants help strengthen your loan application by providing additional income sources and guarantees.
            You can add multiple co-applicants or skip this step if not required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoApplicantForm; 