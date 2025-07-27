import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaFileAlt, FaUser, FaHome, FaCar, FaBuilding, FaUniversity, FaArrowRight } from 'react-icons/fa';

const ApplicationSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formId, loanType } = location.state || {};
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) {
      navigate('/');
      return;
    }

    fetchApplicationData();
  }, [formId]);

  const fetchApplicationData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/multi-step-form/form/${formId}`, {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success) {
        setApplicationData(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching application data:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getLoanIcon = () => {
    switch (loanType) {
      case 'Home Loan': return FaHome;
      case 'Vehicle Loan': return FaCar;
      case 'Personal Loan': return FaUser;
      case 'Business Loan': return FaBuilding;
      case 'Mortgage Loan': return FaUniversity;
      default: return FaFileAlt;
    }
  };

  const LoanIcon = getLoanIcon();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <FaCheck className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Application Submitted Successfully!
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Your {loanType} application has been received and is being processed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Application Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <LoanIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{loanType} Application</h2>
              <p className="text-gray-600">Application ID: {formId}</p>
            </div>
          </div>

          {applicationData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-blue-600">{applicationData.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{new Date(applicationData.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applicants:</span>
                    <span className="font-medium">{applicationData.personalDetails?.length || 1}</span>
                  </div>
                  {applicationData.loanApplication?.loan_amount_required && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-medium">₹{applicationData.loanApplication.loan_amount_required}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Document Verification</p>
                      <p className="text-sm text-gray-600">Our team will verify your documents</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Credit Assessment</p>
                      <p className="text-sm text-gray-600">We&apos;ll evaluate your creditworthiness</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-800">Approval & Disbursement</p>
                      <p className="text-sm text-gray-600">Final approval and loan disbursement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Contact Support</h4>
              <p className="text-blue-700 text-sm mb-2">Phone: +91 9876543210</p>
              <p className="text-blue-700 text-sm">Email: support@incentumfinancial.com</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Processing Time</h4>
              <p className="text-blue-700 text-sm mb-2">Initial Review: 24-48 hours</p>
              <p className="text-blue-700 text-sm">Final Approval: 3-7 business days</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/user-profile')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FaUser className="w-4 h-4" />
            <span>View Profile</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            <span>Back to Home</span>
            <FaArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationSummary; 