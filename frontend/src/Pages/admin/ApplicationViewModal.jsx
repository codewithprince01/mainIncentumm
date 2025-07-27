import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiFileText, FiDollarSign, FiCalendar, FiMapPin, FiPhone, FiMail, FiDownload, FiEdit, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

const ApplicationViewModal = ({ isOpen, onClose, applicationId, onEdit }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplication();
    }
  }, [isOpen, applicationId]);

  const fetchApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/applications/${applicationId}`, {
        withCredentials: true
      });
      setApplication(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/applications/${applicationId}/download`, {
        responseType: 'blob',
        withCredentials: true
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `application-${application.applicationId || applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download application');
    }
  };

  const handleDocumentDownload = async (documentType, applicantIndex = 0, isCoApplicantDoc = false, docFileName = null) => {
    try {
      console.log('Downloading document:', { documentType, applicantIndex, isCoApplicantDoc, docFileName });
      
      // Use the unified backend endpoint for all documents
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/applications/${applicationId}/documents/${documentType}/${applicantIndex}`;
      
      const response = await axios.get(url, {
        responseType: 'blob',
        withCredentials: true
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Use provided filename or generate one
      const fileName = docFileName || `${documentType}-applicant-${applicantIndex + 1}-${applicationId}`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to download document';
      alert(`Download failed: ${errorMsg}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'under_review':
      case 'in progress':
        return <FiClock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDocumentName = (key) => {
    // Convert camelCase to readable format
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([0-9]+)/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                <FiFileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Application Details</h2>
                <p className="text-blue-100 text-sm">
                  {application?.applicationId || applicationId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="bg-white bg-opacity-30 hover:bg-opacity-40 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => onEdit(application)}
                className="bg-white bg-opacity-30 hover:bg-opacity-40 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={onClose}
                className="bg-white bg-opacity-30 hover:bg-opacity-40 text-white p-2 rounded-lg transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-800 font-medium">Loading application details...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            </div>
          ) : application ? (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiFileText className="w-5 h-5 mr-2 text-blue-600" />
                  Application Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Application ID</p>
                    <p className="font-bold text-gray-900 text-lg">{application.applicationId || application._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Loan Type</p>
                    <p className="font-bold text-gray-900 text-lg capitalize">{application.loanType || application.loanApplication?.loanType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Requested Amount</p>
                    <p className="font-bold text-gray-900 text-lg">
                      ₹{(application.loanAmount || application.loanApplication?.loan_amount_required || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Status</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-2 capitalize">{application.status || 'Pending'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Submitted Date</p>
                    <p className="font-bold text-gray-900 flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {application.approvedAmount && (
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Approved Amount</p>
                      <p className="font-bold text-green-700 text-lg">₹{application.approvedAmount.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* User Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                  Applicant Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Full Name</p>
                    <p className="font-bold text-gray-900">{application.userId?.name || application.personalDetails?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Email</p>
                    <p className="font-bold text-gray-900 flex items-center">
                      <FiMail className="w-4 h-4 mr-1" />
                      {application.userId?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Phone Number</p>
                    <p className="font-bold text-gray-900 flex items-center">
                      <FiPhone className="w-4 h-4 mr-1" />
                      {application.userId?.phoneNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Date of Birth</p>
                    <p className="font-bold text-gray-900 flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {application.personalDetails?.dateOfBirth 
                        ? new Date(application.personalDetails.dateOfBirth).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              {application.personalDetails && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiMapPin className="w-5 h-5 mr-2 text-red-600" />
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {application.personalDetails.gender && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Gender</p>
                        <p className="font-bold text-gray-900 capitalize">{application.personalDetails.gender}</p>
                      </div>
                    )}
                    {application.personalDetails.maritalStatus && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Marital Status</p>
                        <p className="font-bold text-gray-900 capitalize">{application.personalDetails.maritalStatus}</p>
                      </div>
                    )}
                    {application.personalDetails.alternatePhone && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Alternate Phone</p>
                        <p className="font-bold text-gray-900">{application.personalDetails.alternatePhone}</p>
                      </div>
                    )}
                  </div>
                  
                  {application.personalDetails.address && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 font-medium mb-2">Address</p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800">
                          {[
                            application.personalDetails.address.street,
                            application.personalDetails.address.city,
                            application.personalDetails.address.state,
                            application.personalDetails.address.pincode,
                            application.personalDetails.address.country
                          ].filter(Boolean).join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Employment Details */}
              {application.employmentDetails && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2 text-purple-600" />
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {application.employmentDetails.employmentType && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Employment Type</p>
                        <p className="font-bold text-gray-900 capitalize">{application.employmentDetails.employmentType.replace('_', ' ')}</p>
                      </div>
                    )}
                    {application.employmentDetails.companyName && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Company Name</p>
                        <p className="font-bold text-gray-900">{application.employmentDetails.companyName}</p>
                      </div>
                    )}
                    {application.employmentDetails.designation && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Designation</p>
                        <p className="font-bold text-gray-900">{application.employmentDetails.designation}</p>
                      </div>
                    )}
                    {application.employmentDetails.workExperience && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Work Experience</p>
                        <p className="font-bold text-gray-900">{application.employmentDetails.workExperience} years</p>
                      </div>
                    )}
                    {application.employmentDetails.monthlyIncome && (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Monthly Income</p>
                        <p className="font-bold text-gray-900">₹{application.employmentDetails.monthlyIncome?.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Co-applicants */}
              {application.coApplicants && application.coApplicants.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUser className="w-5 h-5 mr-2 text-green-600" />
                    Co-applicants ({application.coApplicants.length})
                  </h3>
                  
                  {application.coApplicants.map((coApplicant, index) => (
                    <div key={index} className="mb-6 last:mb-0 border border-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                          {index + 1}
                        </div>
                        Co-applicant {index + 1} - {coApplicant.relationship ? coApplicant.relationship.charAt(0).toUpperCase() + coApplicant.relationship.slice(1) : 'Unknown Relationship'}
                      </h4>
                      
                      {/* Personal Details */}
                      {coApplicant.personalDetails && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Personal Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                            {coApplicant.personalDetails.fullName && (
                              <div>
                                <p className="text-sm text-gray-600">Full Name</p>
                                <p className="font-semibold text-gray-800">{coApplicant.personalDetails.fullName}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.email && (
                              <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-800">{coApplicant.personalDetails.email}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.phoneNumber && (
                              <div>
                                <p className="text-sm text-gray-600">Phone Number</p>
                                <p className="font-semibold text-gray-800">{coApplicant.personalDetails.phoneNumber}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.dateOfBirth && (
                              <div>
                                <p className="text-sm text-gray-600">Date of Birth</p>
                                <p className="font-semibold text-gray-800">{new Date(coApplicant.personalDetails.dateOfBirth).toLocaleDateString()}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.gender && (
                              <div>
                                <p className="text-sm text-gray-600">Gender</p>
                                <p className="font-semibold text-gray-800 capitalize">{coApplicant.personalDetails.gender}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.panNumber && (
                              <div>
                                <p className="text-sm text-gray-600">PAN Number</p>
                                <p className="font-semibold text-gray-800">{coApplicant.personalDetails.panNumber}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.aadharNumber && (
                              <div>
                                <p className="text-sm text-gray-600">Aadhar Number</p>
                                <p className="font-semibold text-gray-800">{coApplicant.personalDetails.aadharNumber}</p>
                              </div>
                            )}
                            {coApplicant.personalDetails.address && (
                              <div className="md:col-span-2 lg:col-span-3">
                                <p className="text-sm text-gray-600">Address</p>
                                <p className="font-semibold text-gray-800">
                                  {[
                                    coApplicant.personalDetails.address.street,
                                    coApplicant.personalDetails.address.city,
                                    coApplicant.personalDetails.address.state,
                                    coApplicant.personalDetails.address.pincode,
                                    coApplicant.personalDetails.address.country
                                  ].filter(Boolean).join(', ') || 'N/A'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Employment Details */}
                      {coApplicant.employmentDetails && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-700 mb-2">Employment Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                            {coApplicant.employmentDetails.employmentType && (
                              <div>
                                <p className="text-sm text-gray-600">Employment Type</p>
                                <p className="font-semibold text-gray-800 capitalize">{coApplicant.employmentDetails.employmentType.replace('_', ' ')}</p>
                              </div>
                            )}
                            {coApplicant.employmentDetails.companyName && (
                              <div>
                                <p className="text-sm text-gray-600">Company Name</p>
                                <p className="font-semibold text-gray-800">{coApplicant.employmentDetails.companyName}</p>
                              </div>
                            )}
                            {coApplicant.employmentDetails.designation && (
                              <div>
                                <p className="text-sm text-gray-600">Designation</p>
                                <p className="font-semibold text-gray-800">{coApplicant.employmentDetails.designation}</p>
                              </div>
                            )}
                            {coApplicant.employmentDetails.workExperience && (
                              <div>
                                <p className="text-sm text-gray-600">Work Experience</p>
                                <p className="font-semibold text-gray-800">{coApplicant.employmentDetails.workExperience} years</p>
                              </div>
                            )}
                            {coApplicant.employmentDetails.monthlyIncome && (
                              <div>
                                <p className="text-sm text-gray-600">Monthly Income</p>
                                <p className="font-semibold text-gray-800">₹{coApplicant.employmentDetails.monthlyIncome.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Documents */}
                      {coApplicant.documents && coApplicant.documents.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Documents</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {coApplicant.documents.map((doc, docIndex) => (
                              <div key={docIndex} className="bg-orange-50 p-3 rounded-lg flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-800 capitalize">{doc.documentType?.replace(/([A-Z])/g, ' $1').trim()}</p>
                                  <p className="text-sm text-gray-600">{doc.fileName}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center text-green-600">
                                    <FiCheckCircle className="w-4 h-4 mr-1" />
                                    <span className="text-xs">Uploaded</span>
                                  </div>
                                  <button
                                    onClick={() => handleDocumentDownload(doc.documentType, index + 1, true, doc.fileName)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors"
                                    title="Download document"
                                  >
                                    <FiDownload className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {((application.documents && application.documents.length > 0) || (application.loanDocuments && application.loanDocuments.length > 0)) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FiFileText className="w-5 h-5 mr-2 text-orange-600" />
                    Documents
                  </h3>
                  
                  {/* Handle LoanApplication model documents */}
                  {application.documents && application.documents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {application.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 capitalize">{doc.type?.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">{doc.filename}</p>
                          </div>
                          <button
                            onClick={() => handleDocumentDownload(doc.type, 0)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Handle Form model documents */}
                  {application.loanDocuments && application.loanDocuments.length > 0 && (
                    <div className="space-y-4">
                      {application.loanDocuments.map((applicantDocs, applicantIndex) => (
                        <div key={applicantIndex} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Applicant {applicantIndex + 1} Documents
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(applicantDocs).map(([docType, docPath]) => {
                              if (!docPath) return null;
                              return (
                                <div key={docType} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">{formatDocumentName(docType)}</p>
                                    <p className="text-sm text-gray-600">PDF Document</p>
                                  </div>
                                  <button
                                    onClick={() => handleDocumentDownload(docType, applicantIndex)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors"
                                  >
                                    <FiDownload className="w-4 h-4" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No application data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationViewModal; 