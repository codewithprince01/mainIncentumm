import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUser, FiFileText, FiDollarSign, FiMapPin } from 'react-icons/fi';
import axios from 'axios';

const ApplicationEditModal = ({ isOpen, onClose, application, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (application) {
      setFormData({
        status: application.status || '',
        loanType: application.loanType || '',
        loanAmount: application.loanAmount || '',
        tenure: application.tenure || '',
        purpose: application.purpose || '',
        personalDetails: application.personalDetails || {},
        employmentDetails: application.employmentDetails || {},
        loanApplication: application.loanApplication || {},
        financialDetails: application.financialDetails || {},
        coApplicants: application.coApplicants || []
      });
    }
  }, [application]);

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (index !== null) {
        // Handle array fields like personalDetails or coApplicants
        if (!Array.isArray(newData[section])) {
          newData[section] = [];
        }
        if (!newData[section][index]) {
          newData[section][index] = {};
        }
        newData[section][index][field] = value;
      } else if (section === 'root') {
        // Handle root level fields
        newData[field] = value;
      } else {
        // Handle nested object fields
        if (!newData[section]) {
          newData[section] = {};
        }
        newData[section][field] = value;
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/applications/${application._id}`, formData, {
        withCredentials: true
      });
      
      onSave(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Edit Application</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleInputChange('root', 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="disbursed">Disbursed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Loan Type</label>
                  <select
                    value={formData.loanType || ''}
                    onChange={(e) => handleInputChange('root', 'loanType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">Home Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="vehicle">Vehicle Loan</option>
                    <option value="education">Education Loan</option>
                    <option value="gold">Gold Loan</option>
                    <option value="mortgage">Mortgage Loan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Loan Amount</label>
                  <input
                    type="number"
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleInputChange('root', 'loanAmount', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter loan amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Tenure (months)</label>
                  <input
                    type="number"
                    value={formData.tenure || ''}
                    onChange={(e) => handleInputChange('root', 'tenure', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tenure in months"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Purpose</label>
                  <textarea
                    value={formData.purpose || ''}
                    onChange={(e) => handleInputChange('root', 'purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter loan purpose"
                  />
                </div>
              </div>
            </div>

            {/* User Information - Read Only */}
            {(application.userId || application.user) && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2" />
                  User Information (Read Only)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-800 py-2">{(application.userId || application.user)?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-800 py-2">{(application.userId || application.user)?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-800 py-2">{(application.userId || application.user)?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details */}
            {formData.personalDetails && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2" />
                  Personal Details
                </h3>
                {Array.isArray(formData.personalDetails) ? (
                  formData.personalDetails.map((detail, index) => (
                    <div key={index} className="mb-6 last:mb-0 border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-700 mb-3">Applicant {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(detail).map(([key, value]) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <input
                              type="text"
                              value={value || ''}
                              onChange={(e) => handleInputChange('personalDetails', key, e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(formData.personalDetails).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleInputChange('personalDetails', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Employment Details */}
            {formData.employmentDetails && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2" />
                  Employment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(formData.employmentDetails).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      {key === 'employmentType' ? (
                        <select
                          value={value || ''}
                          onChange={(e) => handleInputChange('employmentDetails', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="salaried">Salaried</option>
                          <option value="self_employed">Self Employed</option>
                          <option value="business">Business</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="retired">Retired</option>
                        </select>
                      ) : key === 'monthlyIncome' ? (
                        <input
                          type="number"
                          value={value || ''}
                          onChange={(e) => handleInputChange('employmentDetails', key, parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleInputChange('employmentDetails', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loan Application Details */}
            {formData.loanApplication && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2" />
                  Loan Application Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(formData.loanApplication).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      {key.includes('amount') || key.includes('value') ? (
                        <input
                          type="number"
                          value={value || ''}
                          onChange={(e) => handleInputChange('loanApplication', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : key.includes('address') ? (
                        <textarea
                          value={value || ''}
                          onChange={(e) => handleInputChange('loanApplication', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                        />
                      ) : (
                        <input
                          type="text"
                          value={value || ''}
                          onChange={(e) => handleInputChange('loanApplication', key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Details */}
            {formData.financialDetails && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiDollarSign className="w-5 h-5 mr-2" />
                  Financial Details
                </h3>
                
                {formData.financialDetails.bankAccount && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Bank Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(formData.financialDetails.bankAccount).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => {
                              const newBankAccount = { ...formData.financialDetails.bankAccount, [key]: e.target.value };
                              handleInputChange('financialDetails', 'bankAccount', newBankAccount);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.financialDetails.monthlyExpenses && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Monthly Expenses</label>
                    <input
                      type="number"
                      value={formData.financialDetails.monthlyExpenses || ''}
                      onChange={(e) => handleInputChange('financialDetails', 'monthlyExpenses', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Co-applicants */}
            {formData.coApplicants && formData.coApplicants.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2" />
                  Co-applicants
                </h3>
                {formData.coApplicants.map((coApplicant, index) => (
                  <div key={index} className="mb-6 last:mb-0 border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-700 mb-3">Co-applicant {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Relationship</label>
                        <select
                          value={coApplicant.relationship || ''}
                          onChange={(e) => handleInputChange('coApplicants', 'relationship', e.target.value, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="spouse">Spouse</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="son">Son</option>
                          <option value="daughter">Daughter</option>
                          <option value="brother">Brother</option>
                          <option value="sister">Sister</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {coApplicant.personalDetails && Object.entries(coApplicant.personalDetails).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => {
                              const newPersonalDetails = { ...coApplicant.personalDetails, [key]: e.target.value };
                              const newCoApplicant = { ...coApplicant, personalDetails: newPersonalDetails };
                              const newCoApplicants = [...formData.coApplicants];
                              newCoApplicants[index] = newCoApplicant;
                              handleInputChange('root', 'coApplicants', newCoApplicants);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents - Read Only */}
            {application.loanDocuments && application.loanDocuments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2" />
                  Documents Submitted (Read Only)
                </h3>
                {application.loanDocuments.map((docSet, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h4 className="font-medium text-gray-700 mb-3">Applicant {index + 1} Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(docSet).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center space-x-2">
                            <FiFileText className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-xs text-green-600">✓ Submitted</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationEditModal; 