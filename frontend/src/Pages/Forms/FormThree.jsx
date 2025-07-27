import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoDocuments } from "react-icons/io5";
import { FaUser, FaBookOpen } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormThree = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userType, setUserType] = useState("");
    const [loanType, setLoanType] = useState("");
    const [files, setFiles] = useState({});
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [fileErrors, setFileErrors] = useState({}); // To track file size errors

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get("user_type");
        const loan = params.get("loan_type");
        if (type) setUserType(type);
        if (loan) setLoanType(loan);
    }, [location]);

    const FileUploader = ({ name }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: (acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file.size > 3 * 1024 * 1024) { // 3 MB limit
                    setFileErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "File size exceeds 3 MB. Please reduce the size.",
                    }));
                } else {
                    setFileErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: null, // Clear error if file is valid
                    }));
                    setFiles((prevFiles) => ({
                        ...prevFiles,
                        [name]: file,
                    }));
                }
            },
            accept: { 'application/pdf': ['.pdf'] },
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
                {fileErrors[name] && (
                    <p className="text-red-500 text-sm mt-1">{fileErrors[name]}</p>
                )}
                {files[name] && !fileErrors[name] && (
                    <p className="text-sm text-green-600 mt-1">{files[name].name} uploaded</p>
                )}
            </div>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadError(null);
        setUploadSuccess(false);
    
        // Check if any file exceeds 3 MB
        const hasErrors = Object.values(fileErrors).some((error) => error !== null);
        if (hasErrors) {
            toast.error("Please ensure all files are below 3 MB.", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
    
        const formData = new FormData();
        for (const key in files) {
            if (files[key]) {
                formData.append(key, files[key]);
            }
        }
    
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/form/form-three`,
                formData,
                { withCredentials: true }
            );
    
            // Log the server response for debugging
            console.log("Server Response:", response);
    
            // Check if the response indicates success
            if (response.status === 200 && response.data.message === "File uploaded successfully") {
                setUploadSuccess(true);
                toast.success("Form submitted successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                    onClose: () => {
                        navigate("/application-submitted-successfully");
                    },
                });
            } else {
                // Handle unexpected response
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error("File upload error:", error.response || error);
    
            // Log detailed error information
            if (error.response) {
                console.error("Server Error Data:", error.response.data);
                console.error("Server Error Status:", error.response.status);
                setUploadError(error.response.data.message || `Server Error: ${error.response.status}`);
            } else if (error.request) {
                console.error("No response received from server");
                setUploadError("No response received from the server.");
            } else {
                console.error("Request setup error:", error.message);
                setUploadError("Error setting up the request: " + error.message);
            }
    
            toast.error("Form submission failed. Please try again.", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const getDocumentList = () => {
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
                    "2/3 years ITR and Computation"
                ],
                selfEmployed: [
                    "PAN Card", 
                    "Aadhar Card",
                    "Firm Registration Certificate", 
                    "GSTR for Last Year",
                    "Last 6 or 12 Month Current Account Statement", 
                    "Last 12 Month Savings Bank Account Statement",
                    "Existing Loan Account Statement", 
                    "2/3 years ITR and Computation", 
                    "2/3 years Balance Sheets",
                    "NOC / Loan Closure Statements for loans closed in 1 year"
                ]
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
                    "Driving License (Self or Family)"
                ],
                selfEmployed: [
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
                    "Driving License (Self or Family)"
                ]
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
                    "2/3 years ITR and Computation"
                ],
                selfEmployed: [
                    "PAN Card", 
                    "Aadhar Card", 
                    "Firm Registration Certificate", 
                    "GSTR for Last Year",
                    "Last 6 or 12 Month Current Account Statement", 
                    "Last 12 Month Savings Bank Account Statement",
                    "Existing Loan Account Statement", 
                    "2/3 years ITR and Computation", 
                    "2/3 years Balance Sheets",
                    "NOC / Loan Closure Statements for loans closed in 1 year"
                ]
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
                "Other Relevant Documents"
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
                    "2/3 years ITR and Computation"
                ],
                selfEmployed: [
                    "PAN Card", 
                    "Aadhar Card", 
                    "Firm Registration Certificate", 
                    "GSTR for Last Year",
                    "Last 6 or 12 Month Current Account Statement", 
                    "Last 12 Month Savings Bank Account Statement",
                    "Existing Loan Account Statement", 
                    "2/3 years ITR and Computation",
                    "2/3 years Balance Sheets",
                    "NOC / Loan Closure Statements for loans closed in 1 year"
                ]
            }
        };

        if (loanType === "business") return documentLists.business;
        return documentLists[loanType]?.[userType === "salaried" ? "salaried" : "selfEmployed"] || [];
    };

    return (
        <div className="min-h-screen bg-[#010349f0] text-gray-900 flex flex-col lg:flex-row">
            <div className="absolute mt-24 md:mt-32 w-full h-1 bg-[#9ea0c5e7]"></div>
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="w-full lg:w-3/4  sm:p-6 lg:p-8 xl:p-10 -mt-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold mb-3 lg:mb-3 ml-4 sm:ml-8 lg:ml-12">
                    Loan Application
                </h1>
                <p className="text-white ml-4 sm:ml-8 lg:ml-12 mb-6 lg:mb-11 text-sm sm:text-base">
                    Upload the required documents to proceed with the loan application.
                </p>
                {userType && (
                    <form onSubmit={handleSubmit}>
                        <div className="mx-2 sm:mx-4 lg:mx-8 mt-4">
                            <div className="bg-white p-4 sm:p-6 py-8 sm:py-11 rounded-2xl sm:rounded-3xl shadow-md">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                    Upload Documents for {loanType === "business" ? "Business" : userType === "salaried" ? "Salaried" : "Self-Employed"}
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
                                            {getDocumentList().map((doc, index) => {
                                                const fieldNamesMap = {
                                                    "PAN Card": "panCard",
                                                    "PAN Card of Firm": "panCardofFirm",
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
                                                    "Business Account Statement": "businessAccountStatement",
                                                    "Other Relevant Documents": "otherRelevantDocuments"
                                                };
                                                const name = fieldNamesMap[doc] || doc;
                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border border-gray-300 p-2 sm:p-4 text-center">{index + 1}</td>
                                                        <td className="border border-gray-300 p-2 sm:p-4">{doc}</td>
                                                        <td className="border border-gray-300 p-2 sm:p-4">
                                                            <FileUploader name={name} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {uploadError && <p className="text-red-500 mt-4">{uploadError}</p>}
                                <div className="mt-6 sm:mt-8 flex justify-center">
                                    <div className="flex flex-col sm:flex-row justify-center sm:justify-center items-center gap-4 sm:gap-6 w-full max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%]">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            {/* Toast Container */}
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default FormThree;