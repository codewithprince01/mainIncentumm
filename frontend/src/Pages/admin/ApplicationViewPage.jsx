import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiFileText, FiUser, FiMapPin, FiMail, FiPhone, FiCalendar, FiDownload, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ApplicationViewPage = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentViewer, setDocumentViewer] = useState({
    isOpen: false,
    currentIndex: 0,
    documents: []
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/admin/applications/${applicationId}`, {
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
      setLoading(true);
                      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/admin/applications/${applicationId}/download`, {
          responseType: 'blob',
          withCredentials: true
        });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `application-${application?.applicationId || applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentView = (doc, index) => {
    const documents = application.documents || application.loanDocuments || [];
    setDocumentViewer({
      isOpen: true,
      currentIndex: index,
      documents: documents
    });
  };

  const closeDocumentViewer = () => {
    setDocumentViewer({
      isOpen: false,
      currentIndex: 0,
      documents: []
    });
  };

  const nextDocument = () => {
    setDocumentViewer(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.documents.length
    }));
  };

  const previousDocument = () => {
    setDocumentViewer(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.documents.length - 1 : prev.currentIndex - 1
    }));
  };

  const scrollToTop = () => {
    const modalContent = document.querySelector('.document-modal-content');
    if (modalContent) {
      modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setShowScrollTop(scrollTop > 200);
  };

  const getDocumentUrl = (doc) => {
    if (doc.fileUrl) return doc.fileUrl;
    if (doc._id) {
      return `${window.location.origin}/api/admin/applications/${applicationId}/documents/${doc._id}`;
    }
    return null;
  };

  const getDocumentDownloadUrl = (doc) => {
    if (doc.fileUrl) return doc.fileUrl;
    if (doc._id) {
      return `${window.location.origin}/api/admin/applications/${applicationId}/documents/${doc._id}`;
    }
    return null;
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
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-100 mx-auto mb-4"></div>
          <p className="text-indigo-100 font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-indigo-100 mb-2">Error Loading Application</h2>
          <p className="text-indigo-100 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="bg-indigo-900 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-300"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-indigo-100 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-indigo-100 mb-2">Application Not Found</h2>
          <p className="text-indigo-100 mb-6">The requested application could not be found.</p>
          <button
            onClick={() => window.close()}
            className="bg-indigo-900 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors duration-300"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-950">
      {/* Header */}
      <div className="bg-indigo-900 shadow-sm border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.close()}
                className="flex items-center space-x-2 text-indigo-100 hover:text-white transition-colors duration-300"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Close</span>
              </button>
              <div className="h-6 w-px bg-indigo-700"></div>
              <h1 className="text-xl font-semibold text-white">Application Details</h1>
              <span className="text-sm text-indigo-100">
                {application?.applicationId || applicationId}
              </span>
            </div>
            <button
              onClick={handleDownload}
              className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 border border-indigo-700"
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
          <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiFileText className="w-5 h-5 mr-2 text-indigo-100" />
              Application Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-indigo-100 font-medium">Application ID</p>
                <p className="font-bold text-white text-lg">{application.applicationId || application._id}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Loan Type</p>
                <p className="font-bold text-white text-lg capitalize">{application.loanType || application.loanApplication?.loanType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Requested Amount</p>
                <p className="font-bold text-white text-lg">
                  ₹{(application.loanSpecificDetails?.loanAmountRequired || application.loanAmount || application.loanApplication?.loan_amount_required || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Status</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-2 capitalize">{application.status || 'Pending'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Submitted Date</p>
                <p className="font-bold text-white flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>
              {application.approvedAmount && (
                <div>
                  <p className="text-sm text-indigo-100 font-medium">Approved Amount</p>
                  <p className="font-bold text-white text-lg">₹{application.approvedAmount.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FiUser className="w-5 h-5 mr-2 text-indigo-100" />
              Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-indigo-100 font-medium">Full Name</p>
                <p className="font-bold text-white">{application.userId?.name || application.personalDetails?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Email</p>
                <p className="font-bold text-white flex items-center">
                  <FiMail className="w-4 h-4 mr-1" />
                  {application.userId?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Phone Number</p>
                <p className="font-bold text-white flex items-center">
                  <FiPhone className="w-4 h-4 mr-1" />
                  {application.userId?.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 font-medium">Date of Birth</p>
                <p className="font-bold text-white flex items-center">
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
            <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiMapPin className="w-5 h-5 mr-2 text-indigo-100" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {application.personalDetails.fatherName && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Father Name</p>
                    <p className="font-semibold text-white">{application.personalDetails.fatherName}</p>
                  </div>
                )}
                {application.personalDetails.gender && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Gender</p>
                    <p className="font-semibold text-white capitalize">{application.personalDetails.gender}</p>
                  </div>
                )}
                {application.personalDetails.maritalStatus && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Marital Status</p>
                    <p className="font-semibold text-white capitalize">{application.personalDetails.maritalStatus}</p>
                  </div>
                )}
                {application.personalDetails.qualification && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Qualification</p>
                    <p className="font-semibold text-white">{application.personalDetails.qualification}</p>
                  </div>
                )}
                {application.personalDetails.numberOfDependents !== undefined && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Number of Dependents</p>
                    <p className="font-semibold text-white">{application.personalDetails.numberOfDependents}</p>
                  </div>
                )}
                {application.personalDetails.panNumber && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">PAN Number</p>
                    <p className="font-semibold text-white uppercase">{application.personalDetails.panNumber}</p>
                  </div>
                )}
                {application.personalDetails.residenceType && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Residence Type</p>
                    <p className="font-semibold text-white">{application.personalDetails.residenceType}</p>
                  </div>
                )}
                {application.personalDetails.citizenship && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Citizenship</p>
                    <p className="font-semibold text-white">{application.personalDetails.citizenship}</p>
                  </div>
                )}
              </div>
              
              {/* Address Information */}
              {(application.personalDetails.permanentAddress || application.personalDetails.presentAddress) && (
                <div className="mt-6 pt-6 border-t border-indigo-800">
                  <h4 className="text-md font-semibold text-white mb-4">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {application.personalDetails.permanentAddress && (
                      <div className="bg-indigo-800 p-4 rounded-lg">
                        <h5 className="font-medium text-white mb-2">Permanent Address</h5>
                        <div className="space-y-1 text-sm text-indigo-100">
                          {application.personalDetails.permanentAddress.address && (
                            <p>{application.personalDetails.permanentAddress.address}</p>
                          )}
                          {application.personalDetails.permanentAddress.district && (
                            <p>{application.personalDetails.permanentAddress.district}</p>
                          )}
                          {application.personalDetails.permanentAddress.state && (
                            <p>{application.personalDetails.permanentAddress.state}</p>
                          )}
                          {application.personalDetails.permanentAddress.pinCode && (
                            <p>PIN: {application.personalDetails.permanentAddress.pinCode}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {application.personalDetails.presentAddress && (
                      <div className="bg-indigo-800 p-4 rounded-lg">
                        <h5 className="font-medium text-white mb-2">Present Address</h5>
                        <div className="space-y-1 text-sm text-indigo-100">
                          {application.personalDetails.presentAddress.address && (
                            <p>{application.personalDetails.presentAddress.address}</p>
                          )}
                          {application.personalDetails.presentAddress.district && (
                            <p>{application.personalDetails.presentAddress.district}</p>
                          )}
                          {application.personalDetails.presentAddress.state && (
                            <p>{application.personalDetails.presentAddress.state}</p>
                          )}
                          {application.personalDetails.presentAddress.pinCode && (
                            <p>PIN: {application.personalDetails.presentAddress.pinCode}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loan Specific Details */}
          {application.loanSpecificDetails && Object.keys(application.loanSpecificDetails).length > 0 && (
            <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2 text-indigo-100" />
                Loan Specific Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {application.loanSpecificDetails.loanAmountRequired && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Loan Amount Required</p>
                    <p className="font-semibold text-white">₹{application.loanSpecificDetails.loanAmountRequired.toLocaleString()}</p>
                  </div>
                )}
                {application.loanSpecificDetails.propertyAddress && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Property Address</p>
                    <p className="font-semibold text-white">{application.loanSpecificDetails.propertyAddress}</p>
                  </div>
                )}
                {application.loanSpecificDetails.propertyFinalised !== undefined && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Property Finalised</p>
                    <p className="font-semibold text-white">{application.loanSpecificDetails.propertyFinalised ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {application.loanSpecificDetails.agreementExecuted !== undefined && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Agreement Executed</p>
                    <p className="font-semibold text-white">{application.loanSpecificDetails.agreementExecuted ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {application.loanSpecificDetails.agreementValue && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Agreement Value</p>
                    <p className="font-semibold text-white">₹{application.loanSpecificDetails.agreementValue.toLocaleString()}</p>
                  </div>
                )}
                {application.loanSpecificDetails.vehicleMake && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Vehicle Make</p>
                    <p className="font-semibold text-white">{application.loanSpecificDetails.vehicleMake}</p>
                  </div>
                )}
                {application.loanSpecificDetails.vehicleModel && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Vehicle Model</p>
                    <p className="font-semibold text-white">{application.loanSpecificDetails.vehicleModel}</p>
                  </div>
                )}
                {application.loanSpecificDetails.vehiclePrice && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Vehicle Price</p>
                    <p className="font-semibold text-white">₹{application.loanSpecificDetails.vehiclePrice.toLocaleString()}</p>
                  </div>
                )}
              </div>
              {application.loanSpecificDetails.preferredBanks && application.loanSpecificDetails.preferredBanks.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-indigo-100 font-medium mb-2">Preferred Banks</p>
                  <div className="flex flex-wrap gap-2">
                    {application.loanSpecificDetails.preferredBanks.map((bank, index) => (
                      <span key={index} className="bg-indigo-800 text-white px-3 py-1 rounded-full text-sm">
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Employment Details */}
          {application.employmentDetails && Object.keys(application.employmentDetails).length > 0 && (
            <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2 text-indigo-100" />
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Salaried Employee Details */}
                {application.employmentDetails.organisationName && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Organisation Name</p>
                    <p className="font-semibold text-white">{application.employmentDetails.organisationName}</p>
                  </div>
                )}
                {application.employmentDetails.organisationType && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Organisation Type</p>
                    <p className="font-semibold text-white">{application.employmentDetails.organisationType}</p>
                  </div>
                )}
                {application.employmentDetails.designation && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Designation</p>
                    <p className="font-semibold text-white">{application.employmentDetails.designation}</p>
                  </div>
                )}
                {application.employmentDetails.experienceCurrentOrg && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Experience (Current Org)</p>
                    <p className="font-semibold text-white">{application.employmentDetails.experienceCurrentOrg} years</p>
                  </div>
                )}
                {application.employmentDetails.experiencePreviousOrg && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Experience (Previous Org)</p>
                    <p className="font-semibold text-white">{application.employmentDetails.experiencePreviousOrg} years</p>
                  </div>
                )}
                {application.employmentDetails.monthlySalary && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Monthly Salary</p>
                    <p className="font-semibold text-white">₹{application.employmentDetails.monthlySalary.toLocaleString()}</p>
                  </div>
                )}
                {application.employmentDetails.placeOfPosting && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Place of Posting</p>
                    <p className="font-semibold text-white">{application.employmentDetails.placeOfPosting}</p>
                  </div>
                )}
                {application.employmentDetails.salaryBank && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Salary Bank</p>
                    <p className="font-semibold text-white uppercase">{application.employmentDetails.salaryBank}</p>
                  </div>
                )}
                
                {/* Business/Self-Employed Details */}
                {application.employmentDetails.firmName && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Firm Name</p>
                    <p className="font-semibold text-white">{application.employmentDetails.firmName}</p>
                  </div>
                )}
                {application.employmentDetails.firmType && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Firm Type</p>
                    <p className="font-semibold text-white">{application.employmentDetails.firmType}</p>
                  </div>
                )}
                {application.employmentDetails.businessDesignation && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Business Designation</p>
                    <p className="font-semibold text-white">{application.employmentDetails.businessDesignation}</p>
                  </div>
                )}
                {application.employmentDetails.yearsInBusiness && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Years in Business</p>
                    <p className="font-semibold text-white">{application.employmentDetails.yearsInBusiness} years</p>
                  </div>
                )}
                {application.employmentDetails.yearsOfITRFiling && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Years of ITR Filing</p>
                    <p className="font-semibold text-white">{application.employmentDetails.yearsOfITRFiling} years</p>
                  </div>
                )}
                {application.employmentDetails.firmRegistrationDate && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Firm Registration Date</p>
                    <p className="font-semibold text-white">{new Date(application.employmentDetails.firmRegistrationDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {/* Legacy fields for compatibility */}
                {application.employmentDetails.companyName && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Company Name</p>
                    <p className="font-semibold text-white">{application.employmentDetails.companyName}</p>
                  </div>
                )}
                {application.employmentDetails.workExperience && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Work Experience</p>
                    <p className="font-semibold text-white">{application.employmentDetails.workExperience} years</p>
                  </div>
                )}
                {application.employmentDetails.monthlyIncome && (
                  <div>
                    <p className="text-sm text-indigo-100 font-medium">Monthly Income</p>
                    <p className="font-bold text-white">₹{application.employmentDetails.monthlyIncome?.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Co-applicants */}
          {application.coApplicants && application.coApplicants.length > 0 && (
            <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-indigo-100" />
                Co-applicants ({application.coApplicants.length})
              </h3>
              <div className="space-y-6">
                {application.coApplicants.map((coApplicant, index) => (
                  <div key={index} className="border border-indigo-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Co-applicant {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coApplicant.personalDetails?.fullName && (
                        <div>
                          <p className="text-sm text-indigo-100 font-medium">Full Name</p>
                          <p className="font-bold text-white">{coApplicant.personalDetails.fullName}</p>
                        </div>
                      )}
                      {coApplicant.personalDetails?.email && (
                        <div>
                          <p className="text-sm text-indigo-100 font-medium">Email</p>
                          <p className="font-bold text-white">{coApplicant.personalDetails.email}</p>
                        </div>
                      )}
                      {coApplicant.personalDetails?.phoneNumber && (
                        <div>
                          <p className="text-sm text-indigo-100 font-medium">Phone</p>
                          <p className="font-bold text-white">{coApplicant.personalDetails.phoneNumber}</p>
                        </div>
                      )}
                      {coApplicant.employmentDetails?.companyName && (
                        <div>
                          <p className="text-sm text-indigo-100 font-medium">Company</p>
                          <p className="font-bold text-white">{coApplicant.employmentDetails.companyName}</p>
                        </div>
                      )}
                      {coApplicant.employmentDetails?.monthlyIncome && (
                        <div>
                          <p className="text-sm text-indigo-100 font-medium">Monthly Income</p>
                          <p className="font-bold text-white">₹{coApplicant.employmentDetails.monthlyIncome.toLocaleString()}</p>
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
            <div className="bg-indigo-900 rounded-xl shadow-lg border border-indigo-800 p-6 transform transition-all hover:scale-[1.01]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2 text-indigo-100" />
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(application.documents || application.loanDocuments || []).map((doc, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleDocumentView(doc, index)}
                    className="border border-indigo-800 rounded-lg p-4 hover:border-indigo-600 hover:bg-indigo-800 transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <FiFileText className="w-8 h-8 text-indigo-300 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                          📄 {doc.documentType || doc.type || 'Document'}
                        </p>
                        <p className="text-sm text-indigo-100 group-hover:text-indigo-50 transition-colors truncate">
                          {doc.originalname || doc.filename || doc.fileName || doc.name || 'File'}
                        </p>
                        <p className="text-xs text-indigo-300 group-hover:text-green-400 transition-colors mt-1">
                          Click to view document
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

      {/* Document Viewer Modal */}
      {documentViewer.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl max-h-[95vh] w-full mx-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-white">
                  Document Viewer
                </h3>
                <span className="text-sm text-white">
                  {documentViewer.currentIndex + 1} of {documentViewer.documents.length}
                </span>
              </div>
              <button
                onClick={closeDocumentViewer}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            </div>

                         {/* Document Content */}
             <div className="flex-1 p-4 overflow-auto max-h-[70vh] document-modal-content" onScroll={handleScroll}>
               {documentViewer.documents[documentViewer.currentIndex] && (
                 <div className="text-center">
                   <div className="mb-4">
                     <h4 className="text-lg font-semibold text-white mb-2">
                       {documentViewer.documents[documentViewer.currentIndex].documentType || 
                        documentViewer.documents[documentViewer.currentIndex].type || 'Document'}
                     </h4>
                     <p className="text-sm text-white">
                       {documentViewer.documents[documentViewer.currentIndex].fileName || 
                        documentViewer.documents[documentViewer.currentIndex].filename || 
                        documentViewer.documents[documentViewer.currentIndex].originalname || 'File'}
                     </p>
                   </div>
                   
                   <div className="bg-gray-100 rounded-lg p-4 min-h-[500px] flex items-center justify-center relative">
                                           {/* Scroll Indicator */}
                      <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded text-xs z-10">
                        Scroll to view full document
                      </div>
                     {(() => {
                       const doc = documentViewer.documents[documentViewer.currentIndex];
                       const url = getDocumentUrl(doc);
                       const downloadUrl = getDocumentDownloadUrl(doc);
                       
                       // Debug logging
                       console.log('Document object:', doc);
                       console.log('Document URL:', url);
                       console.log('Download URL:', downloadUrl);
                       
                       if (!url) {
                         return (
                           <div className="text-center">
                             <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                             <p className="text-gray-600">Document not available</p>
                           </div>
                         );
                       }

                       // Get file extension from the document object or URL
                       let fileExtension = null;
                       if (doc.fileName) {
                         fileExtension = doc.fileName.split('.').pop()?.toLowerCase();
                       } else if (doc.filename) {
                         fileExtension = doc.filename.split('.').pop()?.toLowerCase();
                       } else if (doc.originalname) {
                         fileExtension = doc.originalname.split('.').pop()?.toLowerCase();
                       } else if (url) {
                         // Fallback: try to get from URL if it has a file extension
                         const urlParts = url.split('.');
                         if (urlParts.length > 1) {
                           const lastPart = urlParts[urlParts.length - 1];
                           // Check if the last part looks like a file extension (not too long and no special chars)
                           if (lastPart.length <= 4 && /^[a-zA-Z0-9]+$/.test(lastPart)) {
                             fileExtension = lastPart.toLowerCase();
                           }
                         }
                       }
                       
                                               if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                          return (
                            <div className="relative w-full">
                              <img 
                                src={url} 
                                alt="Document" 
                                className="w-full max-h-[800px] object-contain rounded-lg shadow-lg"
                                onError={(e) => {
                                  console.error('Image failed to load:', url);
                                  e.target.style.display = 'none';
                                  // Show error message
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'text-center p-4';
                                                                     errorDiv.innerHTML = `
                                      <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                       <p className="text-gray-600 mb-2">Image could not be loaded</p>
                                      <a href="${downloadUrl}" download class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        <FiDownload className="w-4 h-4 mr-2" />
                                        Download Document
                                      </a>
                                    `;
                                  e.target.parentNode.appendChild(errorDiv);
                                }}
                              />
                             <div className="absolute top-4 right-4">
                               <a 
                                 href={downloadUrl} 
                                 download
                                 className="inline-flex items-center px-3 py-2 bg-white bg-opacity-90 text-white rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
                               >
                                 <FiDownload className="w-4 h-4 mr-1" />
                                 Download
                               </a>
                             </div>
                           </div>
                         );
                                               } else if (fileExtension === 'pdf') {
                          return (
                            <div className="relative w-full h-[800px]">
                              <iframe 
                                src={url} 
                                className="w-full h-full border-0 rounded-lg"
                                title="PDF Document"
                                onError={(e) => {
                                  console.error('PDF failed to load:', url);
                                  e.target.style.display = 'none';
                                  // Show error message
                                  const errorDiv = document.createElement('div');
                                  errorDiv.className = 'text-center p-4';
                                                                     errorDiv.innerHTML = `
                                      <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                      <p className="text-gray-600 mb-2">PDF could not be loaded</p>
                                      <a href="${downloadUrl}" download class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                        <FiDownload className="w-4 h-4 mr-2" />
                                        Download Document
                                      </a>
                                    `;
                                  e.target.parentNode.appendChild(errorDiv);
                                }}
                              />
                             <div className="absolute top-4 right-4">
                               <a 
                                 href={downloadUrl} 
                                 download
                                 className="inline-flex items-center px-3 py-2 bg-white bg-opacity-90 text-gray-700 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
                               >
                                 <FiDownload className="w-4 h-4 mr-1" />
                                 Download
                               </a>
                             </div>
                           </div>
                         );
                       } else {
                         return (
                           <div className="text-center">
                             <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">Document Preview Not Available</p>
                             <p className="text-sm text-gray-500 mb-4">File type: {fileExtension?.toUpperCase() || 'Unknown'}</p>
                             <a 
                               href={downloadUrl} 
                               download
                               className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                             >
                               <FiDownload className="w-4 h-4 mr-2" />
                               Download Document
                             </a>
                           </div>
                         );
                       }
                     })()}
                   </div>
                </div>
              )}
            </div>

                         {/* Navigation */}
             {documentViewer.documents.length > 1 && (
               <div className="flex items-center justify-between p-4 border-t border-gray-200">
                 <button
                   onClick={previousDocument}
                   className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                 >
                   <FiChevronLeft className="w-4 h-4" />
                   <span>Previous</span>
                 </button>
                 
                 <div className="flex space-x-2">
                   {documentViewer.documents.map((_, index) => (
                     <button
                       key={index}
                       onClick={() => setDocumentViewer(prev => ({ ...prev, currentIndex: index }))}
                       className={`w-3 h-3 rounded-full transition-colors ${
                         index === documentViewer.currentIndex 
                           ? 'bg-indigo-600' 
                           : 'bg-gray-300 hover:bg-gray-400'
                       }`}
                     />
                   ))}
                 </div>
                 
                 <button
                   onClick={nextDocument}
                   className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                 >
                   <span>Next</span>
                   <FiChevronRight className="w-4 h-4" />
                 </button>
               </div>
             )}

             {/* Scroll to Top Button */}
             {showScrollTop && (
               <button
                 onClick={scrollToTop}
                 className="fixed bottom-20 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
                 title="Scroll to top"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                 </svg>
               </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationViewPage;