import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchFormById, updateFormStatus } from "../../store/formOneSlice";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import DOMPurify from "dompurify";
import AdminNavbar from "./dashboardcomponents/AdminNavbar";

const UserApplications = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewDocsForApplicant, setViewDocsForApplicant] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [documentUrls, setDocumentUrls] = useState({}); // Store pre-fetched document URLs

  const { id: formId } = useParams();
  const sanitizedId = DOMPurify.sanitize(formId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, loading, error } = useSelector((state) => state.form);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
        console.log("CSRF token fetched:", response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err.response?.data || err.message);
      }
    };
    fetchCsrfToken();
  }, []);

  // Fetch form data with admin token
  useEffect(() => {
    if (sanitizedId && csrfToken) {
      console.log("Fetching form with ID:", sanitizedId);
      dispatch(fetchFormById(sanitizedId)).unwrap().catch((err) => {
        console.error("Fetch form failed:", err);
        if (err.status === 401 || err.status === 403) {
          navigate("/admin-login", { replace: true });
        }
      });
    }
  }, [dispatch, sanitizedId, csrfToken, navigate]);

  // Set initial status
  useEffect(() => {
    if (currentForm && currentForm.status) {
      setSelectedStatus(currentForm.status);
      console.log("Initial status set to:", currentForm.status);
    }
  }, [currentForm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (status) => {
    setSelectedStatus(status);
    setShowDropdown(false);
    console.log("Attempting to update status to:", status, "with CSRF token:", csrfToken);
  
    if (!csrfToken) {
      console.error("CSRF token not available");
      alert("Security token not available. Please wait or refresh the page.");
      return;
    }
  
    try {
      const response = await dispatch(
        updateFormStatus({ id: sanitizedId, status, csrfToken })
      ).unwrap();
      console.log("Status updated successfully:", response);
      await dispatch(fetchFormById(sanitizedId));
    } catch (err) {
      console.error("Failed to update status:", err);
      if (err.status === 401 || err.status === 403) {
        navigate("/admin-login", { replace: true });
      } else {
        alert(`Failed to update status: ${err.message || "Unknown error"}`);
      }
    }
  };

  const fetchDocumentUrl = async (docPath, applicantIndex, docKey) => {
    const adminToken = document.cookie.split("adminToken=")[1]?.split(";")[0] || "";
    // Check if docPath is already a full URL; if so, use it directly, otherwise prepend API URL
    const url = docPath.startsWith("http://") || docPath.startsWith("https://") 
      ? docPath 
      : `${import.meta.env.VITE_API_URL}${docPath}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          "Authorization": `Bearer ${adminToken}`,
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error(`Failed to fetch document: ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setDocumentUrls((prev) => ({
        ...prev,
        [`${applicantIndex}_${docKey}`]: objectUrl,
      }));
      return objectUrl;
    } catch (err) {
      console.error(`Error fetching ${docKey} for Applicant ${applicantIndex + 1}:`, err);
      return null;
    }
  };

  const handleViewDocuments = async (applicantIndex) => {
    setViewDocsForApplicant(applicantIndex);
    const documents = currentForm.loanDocuments?.[applicantIndex] || {};
    for (const [key, value] of Object.entries(documents)) {
      if (value && !documentUrls[`${applicantIndex}_${key}`]) {
        await fetchDocumentUrl(value, applicantIndex, key);
        // Add a small delay to avoid rate limiting (e.g., 200ms)
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  };

  const handleDownloadDocuments = async (applicantIndex) => {
    const documents = currentForm.loanDocuments?.[applicantIndex] || {};
    const personalDetail = currentForm.personalDetails[applicantIndex] || {};
    const applicantName = DOMPurify.sanitize(personalDetail.full_name || `Applicant_${applicantIndex + 1}`);
    const docCount = Object.values(documents).filter(Boolean).length;

    if (docCount === 0) {
      alert("No documents available to download.");
      return;
    }

    setIsLoadingDocs(true);
    const zip = new JSZip();
    const folder = zip.folder(`${applicantName}_Documents`);

    const docFields = [
      { key: "panCard", label: "PAN_Card" },
      { key: "panCardofFirm", label: "PAN_Card_of_Firm" },
      { key: "aadharCard", label: "Aadhar_Card" },
      { key: "employerIDCard", label: "Employer_ID_Card" },
      { key: "joiningConfirmationExperienceLetter", label: "Joining_Confirmation_Experience_Letter" },
      { key: "last12MonthSalaryAccountStatement", label: "Last_12_Month_Salary_Account_Statement" },
      { key: "last12MonthSavingsBankAccountStatement", label: "Last_12_Month_Savings_Bank_Account_Statement" },
      { key: "existingLoanAccountStatement", label: "Existing_Loan_Account_Statement" },
      { key: "latest6MonthSalarySlip", label: "Latest_6_Month_Salary_Slip" },
      { key: "form16PartABAnd26AS", label: "Form_16_Part_AB_and_26AS" },
      { key: "itrAndComputation", label: "ITR_and_Computation" },
      { key: "firmRegistrationCertificate", label: "Firm_Registration_Certificate" },
      { key: "gstrLastYear", label: "GSTR_Last_Year" },
      { key: "last6Or12MonthCurrentAccountStatement", label: "Last_6_or_12_Month_Current_Account_Statement" },
      { key: "businessAccountStatement", label: "Business_Account_Statement" },
      { key: "balanceSheets", label: "Balance_Sheets" },
      { key: "nocLoanCloseStatements", label: "NOC_Loan_Closure_Statements" },
      { key: "drivingLicense", label: "Driving_License" },
      { key: "kycProprietorPartnersDirectors", label: "KYC_Proprietor_Partners_Directors" },
      { key: "certificateForIncorporation", label: "Certificate_For_Incorporation" },
      { key: "articleOfAssociation", label: "Article_Of_Association" },
      { key: "memorandumOfAssociation", label: "Memorandum_Of_Association" },
      { key: "otherRelevantDocuments", label: "Other_Relevant_Documents" },
    ];

    try {
      const adminToken = document.cookie.split("adminToken=")[1]?.split(";")[0] || "";
      for (const { key, label } of docFields) {
        const docPath = documents[key];
        if (docPath) {
          // Use full URL if provided, otherwise prepend API URL
          const url = docPath.startsWith("http://") || docPath.startsWith("https://") 
            ? docPath 
            : `${import.meta.env.VITE_API_URL}${docPath}`;
          console.log(`Fetching ${label} from ${url}`);
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/pdf",
              "Authorization": `Bearer ${adminToken}`,
              "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
          });
          if (!response.ok) {
            console.error(`Failed to fetch ${label}: ${response.status} ${response.statusText}`);
            continue;
          }
          const blob = await response.blob();
          if (blob.size === 0) {
            console.warn(`Empty file fetched for ${label} from ${url}`);
          }
          const fileName = `${label}${url.substring(url.lastIndexOf("."))}`;
          folder.file(fileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${applicantName}_Documents.zip`);
      console.log(`Downloaded ${docCount} documents for ${applicantName}`);
    } catch (err) {
      console.error("Download failed:", err);
      alert(`Failed to download documents: ${err.message}`);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <h1 className="text-xl font-medium text-gray-700">Loading Application...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-medium text-red-600">
          Error: {typeof error === "string" ? error : error.message || "Something went wrong"}
        </h1>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-medium text-gray-600">No data found for this application</h1>
      </div>
    );
  }

  const personalDetails = Array.isArray(currentForm.personalDetails) ? currentForm.personalDetails : [];
  const applicants = Array.isArray(currentForm.loanApplication?.applicants) ? currentForm.loanApplication.applicants : [];
  const loanApplication = currentForm.loanApplication || {};
  const loanDocuments = Array.isArray(currentForm.loanDocuments) ? currentForm.loanDocuments : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-gray-800 text-white p-6 rounded-tl-xl md:rounded-bl-xl">
              <div className="flex flex-col items-center">
                <img
                  src="https://placehold.co/80x80"
                  alt="Profile"
                  className="w-20 h-20 rounded-full mb-4 border-2 border-gray-300"
                  onError={(e) => { e.target.src = "https://placehold.co/80x80?text=User"; }}
                />
                <h3 className="text-lg font-semibold">
                  {personalDetails.length > 0 ? personalDetails[0].full_name || "N/A" : "N/A"}
                </h3>
              </div>
              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition cursor-pointer">
                  <i className="fas fa-user text-gray-400"></i> View Profile
                </li>
                <li className="flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition cursor-pointer">
                  <i className="fas fa-file-alt text-gray-400"></i> Documents
                </li>
              </ul>
              <div className="mt-12">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <i className="fas fa-file-alt text-gray-400"></i> Change Application Status
                </p>
                <div className="relative mt-4">
                  <button
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md font-medium flex items-center justify-between hover:bg-gray-600 transition duration-200"
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={!csrfToken}
                  >
                    <span className={`inline-block px-2 py-1 rounded ${getStatusColor(selectedStatus)}`}>
                      {selectedStatus || "Change Status"}
                    </span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  {showDropdown && (
                    <ul className="absolute bg-white border border-gray-200 rounded-md shadow-md mt-2 w-full z-10 text-gray-800">
                      {["Pending", "In Progress", "Approved", "Rejected"].map((status) => (
                        <li
                          key={status}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm font-medium ${getStatusColor(status)}`}
                          onClick={() => handleStatusChange(status)}
                        >
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="w-full md:w-3/4 p-8">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Application Details</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200 flex items-center gap-2">
                  <i className="fas fa-paperclip"></i> Attachments
                </button>
              </div>
              {/* Applicants Section */}
              {personalDetails.length > 0 ? (
                personalDetails.map((personalDetail, index) => {
                  const applicant = applicants[index] || {};
                  const salariedDetails = applicant.salariedDetails || {};
                  const selfEmployedDetails = applicant.selfEmployedDetails || {};

                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Applicant {index + 1}</h3>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewDocuments(index)}
                            className="bg-green-600 text-white px-4 py-1 rounded-md font-medium hover:bg-green-700 transition duration-200 flex items-center gap-2"
                            disabled={isLoadingDocs}
                          >
                            <i className="fas fa-eye"></i> View Documents
                          </button>
                          <button
                            onClick={() => handleDownloadDocuments(index)}
                            className={`bg-blue-600 text-white px-4 py-1 rounded-md font-medium transition duration-200 flex items-center gap-2 ${isLoadingDocs ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                            disabled={isLoadingDocs}
                          >
                            {isLoadingDocs ? (
                              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                            ) : (
                              <i className="fas fa-download"></i>
                            )}
                            {isLoadingDocs ? "Downloading..." : "Download Documents"}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div className="space-y-2">
                          <h4 className="text-md font-medium text-gray-600 border-b border-gray-300 pb-1">Personal Information</h4>
                          {[
                            { label: "Full Name", value: personalDetail.full_name },
                            { label: "Father Name", value: personalDetail.father_name },
                            { label: "Mobile Number", value: personalDetail.mobile_number },
                            { label: "Email ID", value: personalDetail.email_id },
                            { label: "Date of Birth", value: personalDetail.dob },
                            { label: "Gender", value: personalDetail.gender },
                            { label: "Qualification", value: personalDetail.qualification },
                            { label: "Employment Type", value: personalDetail.employment_type },
                            { label: "Marital Status", value: personalDetail.marital_status },
                            { label: "Spouse Employment Type", value: personalDetail.spouse_employment_type },
                            { label: "No. of Dependents", value: personalDetail.no_of_dependents },
                            { label: "PAN Number", value: personalDetail.pan_number },
                            { label: "Residence Type", value: personalDetail.residence_type },
                            { label: "Citizenship", value: personalDetail.citizenship },
                          ].map(({ label, value }) => (
                            <p key={label} className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">{label}:</span> <span>{value || "N/A"}</span>
                            </p>
                          ))}
                        </div>
                        {/* Permanent Address */}
                        <div className="space-y-2">
                          <h4 className="text-md font-medium text-gray-600 border-b border-gray-300 pb-1">Permanent Address</h4>
                          {[
                            { label: "State", value: personalDetail.permanent_state },
                            { label: "District", value: personalDetail.permanent_district },
                            { label: "Address", value: personalDetail.permanent_address },
                            { label: "Pincode", value: personalDetail.permanent_pincode },
                          ].map(({ label, value }) => (
                            <p key={label} className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">{label}:</span> <span>{value || "N/A"}</span>
                            </p>
                          ))}
                        </div>
                        {/* Present Address */}
                        <div className="space-y-2">
                          <h4 className="text-md font-medium text-gray-600 border-b border-gray-300 pb-1">Present Address</h4>
                          {[
                            { label: "State", value: personalDetail.present_state },
                            { label: "District", value: personalDetail.present_district },
                            { label: "Address", value: personalDetail.present_address },
                            { label: "Pincode", value: personalDetail.present_pincode },
                          ].map(({ label, value }) => (
                            <p key={label} className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">{label}:</span> <span>{value || "N/A"}</span>
                            </p>
                          ))}
                        </div>
                        {/* Employment Details */}
                        <div className="space-y-2">
                          <h4 className="text-md font-medium text-gray-600 border-b border-gray-300 pb-1">Employment Details</h4>
                          {applicant.user_type === "Salaried" ? (
                            [
                              { label: "User Type", value: applicant.user_type },
                              { label: "Organisation Name", value: salariedDetails.organisation_name },
                              { label: "Organisation Type", value: salariedDetails.organisation_type },
                              { label: "Current Experience", value: salariedDetails.currentOrganizationExperience },
                              { label: "Previous Experience", value: salariedDetails.previousOrganizationExperience },
                              { label: "Designation", value: salariedDetails.designation_salaried },
                              { label: "Place of Posting", value: salariedDetails.place_of_posting },
                              { label: "Monthly Salary", value: salariedDetails.monthly_salary },
                              { label: "Salary Bank Name", value: salariedDetails.salary_bank_name },
                            ].map(({ label, value }) => (
                              <p key={label} className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">{label}:</span> <span>{value || "N/A"}</span>
                              </p>
                            ))
                          ) : applicant.user_type === "Self-Employed" ? (
                            [
                              { label: "User Type", value: applicant.user_type },
                              { label: "Company Name", value: selfEmployedDetails.company_name },
                              { label: "Company Type", value: selfEmployedDetails.company_type },
                              { label: "Incorporation Date", value: selfEmployedDetails.incorporation_date },
                              { label: "Designation", value: selfEmployedDetails.designation_self },
                              { label: "Years in Business", value: selfEmployedDetails.years_in_business },
                              { label: "Years of ITR Filing", value: selfEmployedDetails.years_of_itr_filing },
                            ].map(({ label, value }) => (
                              <p key={label} className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">{label}:</span> <span>{value || "N/A"}</span>
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600">User Type: N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center p-6 bg-gray-100 rounded-lg">No applicant details available</p>
              )}
              {/* Document Viewer Modal */}
              {viewDocsForApplicant !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Documents for Applicant {viewDocsForApplicant + 1}
                      </h3>
                      <button onClick={() => setViewDocsForApplicant(null)} className="text-gray-600 hover:text-gray-800">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    {loanDocuments[viewDocsForApplicant] ? (
                      <>
                        <ul className="space-y-2 mb-4">
                          {[
                            { key: "panCard", label: "PAN Card" },
                            { key: "panCardofFirm", label: "PAN Card of Firm" },
                            { key: "aadharCard", label: "Aadhar Card" },
                            { key: "employerIDCard", label: "Employer ID Card" },
                            { key: "joiningConfirmationExperienceLetter", label: "Joining/Confirmation/Experience Letter" },
                            { key: "last12MonthSalaryAccountStatement", label: "Last 12 Month Salary Account Statement" },
                            { key: "last12MonthSavingsBankAccountStatement", label: "Last 12 Month Savings Bank Account Statement" },
                            { key: "existingLoanAccountStatement", label: "Existing Loan Account Statement" },
                            { key: "latest6MonthSalarySlip", label: "Latest 6 Month Salary Slip" },
                            { key: "form16PartABAnd26AS", label: "Form 16 (Part A & B) and 26AS" },
                            { key: "itrAndComputation", label: "ITR and Computation" },
                            { key: "firmRegistrationCertificate", label: "Firm Registration Certificate" },
                            { key: "gstrLastYear", label: "GSTR Last Year" },
                            { key: "last6Or12MonthCurrentAccountStatement", label: "Last 6 or 12 Month Current Account Statement" },
                            { key: "businessAccountStatement", label: "Business Account Statement" },
                            { key: "balanceSheets", label: "Balance Sheets" },
                            { key: "nocLoanCloseStatements", label: "NOC/Loan Closure Statements" },
                            { key: "drivingLicense", label: "Driving License" },
                            { key: "kycProprietorPartnersDirectors", label: "KYC Proprietor/Partners/Directors" },
                            { key: "certificateForIncorporation", label: "Certificate For Incorporation" },
                            { key: "articleOfAssociation", label: "Article Of Association" },
                            { key: "memorandumOfAssociation", label: "Memorandum Of Association" },
                            { key: "otherRelevantDocuments", label: "Other Relevant Documents" },
                          ].map(({ key, label }) => {
                            const value = loanDocuments[viewDocsForApplicant]?.[key];
                            const docUrl = documentUrls[`${viewDocsForApplicant}_${key}`];
                            if (value) {
                              return (
                                <li key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                  <span className="text-sm text-gray-700">{label}</span>
                                  {docUrl ? (
                                    <a
                                      href={docUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-gray-500 text-sm">Loading...</span>
                                  )}
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setViewDocsForApplicant(null)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition duration-200 flex items-center gap-2"
                          >
                            <i className="fas fa-cut"></i> Close
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 text-center">No documents available</p>
                    )}
                  </div>
                </div>
              )}
              {/* Loan Application Details */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan Application Details</h3>
                <div className="space-y-2">
                  {[
                    { label: "Application No", value: currentForm._id },
                    { label: "Loan Type", value: loanApplication.loanType },
                    { label: "Property Finalised", value: loanApplication.property_finalised },
                    { label: "Property Address", value: loanApplication.property_address },
                    { label: "Agreement Executed", value: loanApplication.agreement_executed },
                    { label: "Agreement/MOU Value", value: loanApplication.agreement_mou_value },
                    { label: "Loan Amount Required", value: loanApplication.loan_amount_required ? `₹${loanApplication.loan_amount_required.toLocaleString()}` : "N/A" },
                    { label: "Preferred Banks", value: loanApplication.preferred_banks },
                    { label: "Status", value: selectedStatus || currentForm.status, className: getStatusColor(selectedStatus || currentForm.status) },
                  ].map(({ label, value, className }) => (
                    <p key={label} className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">{label}:</span> <span className={className || ""}>{value || "N/A"}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200 flex items-center gap-2">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplications;