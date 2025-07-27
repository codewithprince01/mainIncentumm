import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiFileText, FiUser, FiMapPin, FiMail, FiPhone, FiCalendar, FiDownload, FiArrowLeft } from 'react-icons/fi';

const ApplicationViewPage = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/applications/${applicationId}`, {
          withCredentials: true
        });
        setApplication(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/admin/applications/${applicationId}/download`, {
        responseType: 'blob',
        withCredentials: true
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `application-${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      case 'submitted': return '📋';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Application</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">The requested application could not be found.</p>
          <button
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.close()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Close</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">Application Details</h1>
              <span className="text-sm text-gray-500">
                {application?.applicationId || applicationId}
              </span>
            </div>
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Application Overview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
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
          <div className="bg-white rounded-xl shadow-sm border p-6">
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
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-red-600" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="mt-6">
                  <p className="text-sm text-gray-700 font-medium mb-2">Address</p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">
                      {application.personalDetails.address.street && `${application.personalDetails.address.street}, `}
                      {application.personalDetails.address.city && `${application.personalDetails.address.city}, `}
                      {application.personalDetails.address.state && `${application.personalDetails.address.state} `}
                      {application.personalDetails.address.pincode && `- ${application.personalDetails.address.pincode}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Employment Details */}
          {application.employmentDetails && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2 text-purple-600" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-green-600" />
                Co-applicants ({application.coApplicants.length})
              </h3>
              <div className="space-y-6">
                {application.coApplicants.map((coApplicant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Co-applicant {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coApplicant.personalDetails?.fullName && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Full Name</p>
                          <p className="font-bold text-gray-900">{coApplicant.personalDetails.fullName}</p>
                        </div>
                      )}
                      {coApplicant.personalDetails?.email && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Email</p>
                          <p className="font-bold text-gray-900">{coApplicant.personalDetails.email}</p>
                        </div>
                      )}
                      {coApplicant.personalDetails?.phoneNumber && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Phone</p>
                          <p className="font-bold text-gray-900">{coApplicant.personalDetails.phoneNumber}</p>
                        </div>
                      )}
                      {coApplicant.employmentDetails?.companyName && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Company</p>
                          <p className="font-bold text-gray-900">{coApplicant.employmentDetails.companyName}</p>
                        </div>
                      )}
                      {coApplicant.employmentDetails?.monthlyIncome && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium">Monthly Income</p>
                          <p className="font-bold text-gray-900">₹{coApplicant.employmentDetails.monthlyIncome.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {((application.documents && application.documents.length > 0) || (application.loanDocuments && application.loanDocuments.length > 0)) && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2 text-orange-600" />
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(application.documents || application.loanDocuments || []).map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FiFileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.documentType || doc.type || 'Document'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {doc.originalname || doc.filename || doc.name || 'File'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationViewPage; 