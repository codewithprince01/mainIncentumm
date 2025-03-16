import React, { useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { IoDocuments } from "react-icons/io5";
import { FaUser, FaBookOpen } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { uploadLoanDocuments, resetUploadState } from "../../store/formOneSlice";
import { UserContext } from "../../contextapi/UserContext";

const Coformthree = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formData, loading, error, success, documents, userId } = useSelector((state) => state.form);
  const { user } = useContext(UserContext);

  const [applicantsData, setApplicantsData] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const { numberOfApplicants, userId: stateUserId } = location.state || {};
    const parsedApplicants = [];
    const searchString = location.search;

    console.log("URL Search Params:", searchString);
    console.log("Number of Applicants from State:", numberOfApplicants);
    console.log("UserId from Redux:", userId);
    console.log("UserId from location.state:", stateUserId);
    console.log("FormData from Redux:", formData);

    for (let i = 1; i <= (numberOfApplicants || 0); i++) {
      const applicantKey = `applicant${i}`;
      const loanType = params.get(applicantKey);
      if (loanType) {
        const applicantPattern = `${applicantKey}=${loanType}&user_type=([^&]*)`;
        const regex = new RegExp(applicantPattern);
        const match = searchString.match(regex);
        const userType = match && match[1] ? match[1].trim().toLowerCase() : "self_employed";
        const finalUserType = userType === "salaried" ? "salaried" : "self_employed";

        parsedApplicants.push({
          loanType: loanType || "home",
          userType: finalUserType,
        });
      }
    }

    setApplicantsData(parsedApplicants);
    setFiles(parsedApplicants.map(() => ({})));
    setFileErrors(parsedApplicants.map(() => ({})));
    console.log("Parsed Applicants Data:", parsedApplicants);
  }, [location]);

  useEffect(() => {
    if (success) {
      toast.success("Documents uploaded successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          dispatch(resetUploadState());
          navigate("/application-submitted-successfully");
        },
      });
    }
    if (error) {
      toast.error(error.message || "Failed to upload documents.", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => dispatch(resetUploadState()),
      });
    }
  }, [success, error, dispatch, navigate]);

  const FileUploader = ({ name, applicantIndex }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > 3 * 1024 * 1024) {
          setFileErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[applicantIndex] = {
              ...newErrors[applicantIndex],
              [name]: "File size exceeds 3 MB. Please reduce the size.",
            };
            return newErrors;
          });
        } else {
          setFileErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[applicantIndex] = {
              ...newErrors[applicantIndex],
              [name]: null,
            };
            return newErrors;
          });
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[applicantIndex] = {
              ...newFiles[applicantIndex],
              [name]: file,
            };
            return newFiles;
          });
        }
      },
      accept: { "application/pdf": [".pdf"] },
    });

    return (
      <div>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-blue-400 rounded-md p-2 sm:p-4 text-center cursor-pointer hover:bg-blue-50 transition"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 text-sm sm:text-base">Drop the files here...</p>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">
              Drag and drop files here or <span className="text-blue-500 underline">Select files</span>
            </p>
          )}
        </div>
        {fileErrors[applicantIndex]?.[name] && (
          <p className="text-red-500 text-sm mt-1">{fileErrors[applicantIndex][name]}</p>
        )}
        {files[applicantIndex]?.[name] && !fileErrors[applicantIndex]?.[name] && (
          <p className="text-sm text-green-600 mt-1">{files[applicantIndex][name].name} uploaded</p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is authenticated
    if (!user) {
      toast.error("User not authenticated. Please log in.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Check for file errors
    const hasErrors = fileErrors.some((applicantErrors) =>
      Object.values(applicantErrors).some((error) => error !== null)
    );

    if (hasErrors) {
      toast.error("Please ensure all files are below 3 MB.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Check if any files are selected
    const hasFiles = files.some((applicantFiles) => Object.keys(applicantFiles).length > 0);
    if (!hasFiles) {
      toast.error("Please upload at least one document.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const uploadPromises = files
        .map((applicantFiles, index) => {
          if (Object.keys(applicantFiles).length > 0) {
            return dispatch(
              uploadLoanDocuments({
                userId: user.id,
                applicantIndex: index,
                files: applicantFiles,
              })
            ).unwrap(); // unwrap to handle promise resolution
          }
          return null;
        })
        .filter(Boolean); // Remove null promises

      console.log("Submitting with userId:", user.id);
      console.log("Files to submit:", files);

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Success is handled in useEffect
    } catch (error) {
      console.error("Error during document upload:", error);
      toast.error("An error occurred while uploading documents. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const getDocumentList = (loanType, userType) => {
    const documentLists = {
      home: {
        salaried: [
          "PAN Card",
          "Aadhar Card",
          "Employer ID Card",
          "Joining/Confirmation/Experience Letter",
          "Last 12 Month Salary Account Statement",
          "Existing Loan Account Statement",
          "Latest 6 Month Salary Slip",
          "2/3 years Form 16 (Part A & B) and 26 AS",
          "2/3 years ITR and Computation",
        ],
        self_employed: [
          "PAN Card",
          "Aadhar Card",
          "Firm Registration Certificate",
          "GSTR for Last Year",
          "Last 6 or 12 Month Current Account Statement",
          "Last 12 Month Savings Bank Account Statement",
          "Existing Loan Account Statement",
          "2/3 years ITR and Computation",
          "2/3 years Balance Sheets",
          "NOC / Loan Closure Statements for loans closed in 1 year",
        ],
      },
      vehicle: {
        salaried: [
          "PAN Card",
          "Aadhar Card",
          "Employer ID Card",
          "Joining/Confirmation/Experience Letter",
          "Last 12 Month Salary Account Statement",
          "Existing Loan Account Statement",
          "Latest 6 Month Salary Slip",
          "2/3 years Form 16 (Part A & B) and 26 AS",
          "2/3 years ITR and Computation",
          "NOC / Loan Closure Statements for loans closed in 1 year",
          "Driving License (Self or Family)",
        ],
        self_employed: [
          "PAN Card",
          "Aadhar Card",
          "Firm Registration Certificate",
          "GSTR for Last Year",
          "Last 6 or 12 Month Current Account Statement",
          "Last 12 Month Savings Bank Account Statement",
          "Existing Loan Account Statement",
          "2/3 years ITR and Computation",
          "2/3 years Balance Sheets",
          "NOC / Loan Closure Statements for loans closed in 1 year",
          "Driving License (Self or Family)",
        ],
      },
      personal: {
        salaried: [
          "PAN Card",
          "Aadhar Card",
          "Employer ID Card",
          "Joining/Confirmation/Experience Letter",
          "Last 12 Month Salary Account Statement",
          "Existing Loan Account Statement",
          "Latest 6 Month Salary Slip",
          "2/3 years Form 16 (Part A & B) and 26 AS",
          "2/3 years ITR and Computation",
        ],
        self_employed: [
          "PAN Card",
          "Aadhar Card",
          "Firm Registration Certificate",
          "GSTR for Last Year",
          "Last 6 or 12 Month Current Account Statement",
          "Last 12 Month Savings Bank Account Statement",
          "Existing Loan Account Statement",
          "2/3 years ITR and Computation",
          "2/3 years Balance Sheets",
          "NOC / Loan Closure Statements for loans closed in 1 year",
        ],
      },
      business: [
        "PAN Card of Firm",
        "KYC of Proprietor/Partners/Directors",
        "Firm Registration Certificate",
        "Certificate For Incorporation",
        "Article Of Association",
        "Memorandum Of Association",
        "GSTR for Last Year",
        "Last 6 or 12 Month Business Account Statement",
        "Last 12 Month Savings Bank Account Statement",
        "Existing Loan Account Statement",
        "2/3 years ITR and Computation",
        "2/3 years Balance Sheets",
        "NOC / Loan Closure Statements for loans closed in 1 year",
        "Other Relevant Documents",
      ],
      mortgage: {
        salaried: [
          "PAN Card",
          "Aadhar Card",
          "Employer ID Card",
          "Joining/Confirmation/Experience Letter",
          "Last 12 Month Salary Account Statement",
          "Existing Loan Account Statement",
          "Latest 6 Month Salary Slip",
          "2/3 years Form 16 (Part A & B) and 26 AS",
          "2/3 years ITR and Computation",
        ],
        self_employed: [
          "PAN Card",
          "Aadhar Card",
          "Firm Registration Certificate",
          "GSTR for Last Year",
          "Last 6 or 12 Month Current Account Statement",
          "Last 12 Month Savings Bank Account Statement",
          "Existing Loan Account Statement",
          "2/3 years ITR and Computation",
          "2/3 years Balance Sheets",
          "NOC / Loan Closure Statements for loans closed in 1 year",
        ],
      },
    };

    return loanType === "business" ? documentLists.business : documentLists[loanType]?.[userType] || [];
  };

  return (
    <div className="min-h-screen bg-[#010349f0] text-gray-900 flex flex-col lg:flex-row">
      <div className="absolute mt-24 md:mt-32 w-full h-1 bg-[#9ea0c5e7]"></div>
      <div className="w-full lg:w-1/4 py-10 px-4 lg:pl-16 flex flex-col shadow-xl relative rounded-r-3xl">
        <h2 className="text-2xl lg:text-3xl font-bold lg:mb-14 text-white tracking-wide text-center -mt-3">
          Application<br />Process
        </h2>
        <ul className="relative mr-10 hidden lg:block">
          <div className="absolute right-6 top-12 bottom-0 w-1 bg-[#9ea0c5e7] mb-3"></div>
          <li className="flex items-center justify-end space-x-6 mb-12 lg:mb-16 cursor-pointer relative group">
            <div className="text-right">
              <span className="text-lg lg:text-xl font-medium text-white group-hover:text-[#26cc88] transition-colors">
                Personal Information
              </span>
              <div className="text-sm text-gray-400">Browse and Upload</div>
            </div>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#484a7b] rounded-full text-black font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <FaUser className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
          <li className="flex items-center justify-end space-x-6 mb-12 lg:mb-16 cursor-pointer relative group">
            <div className="text-right">
              <span className="text-lg lg:text-xl font-medium text-white group-hover:text-[#26cc88] transition-colors">
                Employment Status
              </span>
              <div className="text-sm text-gray-400">Browse and Upload</div>
            </div>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#484a7b] rounded-full text-white font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <FaBookOpen className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
          <li className="flex items-center justify-end space-x-6 cursor-pointer relative group">
            <div className="text-right">
              <span className="text-lg lg:text-xl font-medium text-[#26cc88] group-hover:text-[#26cc88] transition-colors">
                Documents
              </span>
              <div className="text-sm text-gray-400">Browse and Upload</div>
            </div>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#26cc88] rounded-full text-white font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <IoDocuments className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
        </ul>
        <div className="hidden lg:block absolute top-[8rem] right-0 h-screen w-1 bg-[#b1b3d7ef]">
          <div className="absolute top-[3.5rem] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#484a7b] border-4 border-[#383a69] rounded-full"></div>
          <div className="absolute top-[10.5rem] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#484a7b] border-4 border-[#383a69] rounded-full"></div>
          <div className="absolute top-[17.5rem] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#26cc88] rounded-full"></div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 sm:p-6 lg:p-8 xl:p-10 -mt-2">
        <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-3 lg:mb-3 ml-4 sm:ml-8 lg:ml-12">
          Loan Application - Co-Applicant Documents
        </h1>
        <p className="text-white ml-4 sm:ml-8 lg:ml-12 mb-6 lg:mb-11 text-sm sm:text-base">
          Upload the required documents for all applicants.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mx-2 sm:mx-4 lg:mx-8 mt-4">
            {applicantsData.length > 0 ? (
              applicantsData.map((applicant, index) => (
                <div key={index} className="bg-white p-4 sm:p-6 py-8 sm:py-11 rounded-2xl sm:rounded-3xl shadow-md mb-6">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Upload Documents for Applicant {index + 1} -{" "}
                    {applicant.loanType === "business"
                      ? "Business"
                      : applicant.userType === "salaried"
                      ? "Salaried"
                      : "Self-Employed"}
                  </h1>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 sm:p-4 text-left">#</th>
                          <th className="border border-gray-300 p-2 sm:p-4 text-left">Document Name</th>
                          <th className="border border-gray-300 p-2 sm:p-4 text-left">Upload Documents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDocumentList(applicant.loanType, applicant.userType).map((doc, docIndex) => {
                          const fieldNamesMap = {
                            "PAN Card": "panCard",
                            "PAN Card of Firm": "panCard",
                            "Aadhar Card": "aadharCard",
                            "Employer ID Card": "employerIDCard",
                            "Joining/Confirmation/Experience Letter": "joiningConfirmationExperienceLetter",
                            "Last 12 Month Salary Account Statement": "last12MonthSalaryAccountStatement",
                            "Last 12 Month Savings Bank Account Statement": "last12MonthSavingsAccountStatement",
                            "Existing Loan Account Statement": "existingLoanAccountStatement",
                            "Latest 6 Month Salary Slip": "latest6MonthSalarySlip",
                            "2/3 years Form 16 (Part A & B) and 26 AS": "form16PartABAnd26AS",
                            "2/3 years ITR and Computation": "itrAndComputation",
                            "Firm Registration Certificate": "firmRegistrationCertificate",
                            "GSTR for Last Year": "gstrLastYear",
                            "Last 6 or 12 Month Current Account Statement": "last6Or12MonthCurrentAccountStatement",
                            "Last 6 or 12 Month Business Account Statement": "last6Or12MonthBusinessAccountStatement",
                            "2/3 years Balance Sheets": "balanceSheets",
                            "NOC / Loan Closure Statements for loans closed in 1 year": "nocLoanCloseStatements",
                            "Driving License (Self or Family)": "drivingLicense",
                            "KYC of Proprietor/Partners/Directors": "kycProprietorPartnersDirectors",
                            "Certificate For Incorporation": "certificateForIncorporation",
                            "Article Of Association": "articleOfAssociation",
                            "Memorandum Of Association": "memorandumOfAssociation",
                            "Other Relevant Documents": "otherRelevantDocuments",
                          };
                          const name = fieldNamesMap[doc] || doc.toLowerCase().replace(/ /g, "");
                          return (
                            <tr key={docIndex} className="hover:bg-gray-50">
                              <td className="border border-gray-300 p-2 sm:p-4 text-center">{docIndex + 1}</td>
                              <td className="border border-gray-300 p-2 sm:p-4">{doc}</td>
                              <td className="border border-gray-300 p-2 sm:p-4">
                                <FileUploader name={name} applicantIndex={index} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No applicants data available. Please complete the previous steps.</p>
            )}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Coformthree;