import { motion } from 'framer-motion';
import { FaPlus, FaCheck, FaUsers, FaArrowLeft, FaUser, FaBriefcase, FaFileAlt, FaTimes, FaEdit } from 'react-icons/fa';

const CoApplicantManager = ({ 
  coApplicants, 
  onAddCoApplicant, 
  onFinish, 
  onBack, 
  loanType,
  onEditCoApplicant,
  onRemoveCoApplicant,
  isSubmitting = false 
}) => {
  
  const getCompletionStatus = (coApplicant) => {
    let completed = 0;
    let total = 3; // Personal, Employment, Documents

    // Check personal details completion
    if (coApplicant.personalDetails?.full_name && 
        coApplicant.personalDetails?.email_id && 
        coApplicant.personalDetails?.mobile_number) {
      completed++;
    }

    // Check employment details completion
    if (coApplicant.employmentDetails?.employment_type) {
      completed++;
    }

    // Check documents completion (at least 2 documents uploaded)
    const documents = coApplicant.documents || {};
    const uploadedDocs = Object.values(documents).filter(doc => doc && doc.fileName);
    if (uploadedDocs.length >= 2) {
      completed++;
    }

    return { completed, total };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
            <FaUsers className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Co-Applicant Management
          </h2>
        </div>
        <p className="text-white">
          Would you like to add a co-applicant to strengthen your {loanType.toLowerCase()} application?
        </p>
      </div>

      {/* Current Co-Applicants */}
      {coApplicants.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Added Co-Applicants ({coApplicants.length})
          </h3>
          <div className="space-y-4">
            {coApplicants.map((coApplicant, index) => {
              const status = getCompletionStatus(coApplicant);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    status.completed === status.total 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status.completed === status.total ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {status.completed === status.total ? (
                            <FaCheck className="w-5 h-5 text-green-600" />
                          ) : (
                            <FaUser className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {coApplicant.personalDetails?.full_name || `Co-Applicant ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {coApplicant.relationship && (
                              <span className="capitalize">
                                {coApplicant.relationship.replace('_', ' ')} • 
                              </span>
                            )}
                            {status.completed} of {status.total} steps completed
                          </p>
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <div className="flex items-center space-x-4 ml-13">
                        <div className={`flex items-center space-x-1 text-xs ${
                          coApplicant.personalDetails?.full_name && 
                          coApplicant.personalDetails?.email_id && 
                          coApplicant.personalDetails?.mobile_number ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <FaUser className="w-3 h-3" />
                          <span>Personal</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-xs ${
                          coApplicant.employmentDetails?.employment_type ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <FaBriefcase className="w-3 h-3" />
                          <span>Employment</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-xs ${
                          (coApplicant.documents && Object.keys(coApplicant.documents).length >= 2) ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <FaFileAlt className="w-3 h-3" />
                          <span>Documents</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEditCoApplicant?.(index)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Co-Applicant"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveCoApplicant?.(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove Co-Applicant"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Do you want to add a co-applicant?
        </h3>
        <p className="text-blue-700 text-sm mb-4">
          Adding a co-applicant can increase your loan eligibility and improve approval chances
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Co-Applicant */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddCoApplicant}
          className="p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <FaPlus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Yes, Add Co-Applicant
            </h3>
            <p className="text-sm text-gray-600">
              Add a co-applicant to strengthen your loan application with combined income
            </p>
          </div>
        </motion.button>

        {/* Finish Application */}
        <motion.button
          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          onClick={onFinish}
          disabled={isSubmitting}
          className={`p-6 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          } text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <FaCheck className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {isSubmitting ? 'Submitting...' : 'No, Finish Application'}
            </h3>
            <p className="text-sm opacity-90">
              {isSubmitting 
                ? 'Please wait while we process your application'
                : 'Complete your loan application without co-applicant and submit for processing'
              }
            </p>
          </div>
        </motion.button>
      </div>

      {/* Benefits of Co-Applicants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Benefits of Adding Co-Applicants
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-800">Higher Loan Amount</h5>
                <p className="text-sm text-gray-600">Combined income increases eligibility</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-800">Better Interest Rates</h5>
                <p className="text-sm text-gray-600">Lower risk profile for lenders</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-800">Faster Approval</h5>
                <p className="text-sm text-gray-600">Stronger application profile</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h5 className="font-medium text-gray-800">Shared Responsibility</h5>
                <p className="text-sm text-gray-600">Joint liability reduces risk</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Application Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 rounded-lg p-6 mb-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Application Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {coApplicants.length + 1}
            </div>
            <div className="text-sm text-gray-600">Total Applicants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {loanType}
            </div>
            <div className="text-sm text-gray-600">Loan Type</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {coApplicants.every(ca => getCompletionStatus(ca).completed === getCompletionStatus(ca).total) ? 'Ready' : 'In Progress'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Previous Step</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CoApplicantManager; 