import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/form/Input.jsx";
import Dropdown from "../../components/form/Dropdown.jsx";
import Button from "../../components/form/Button.jsx";
import { FaUser } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { UserContext } from "../../contextapi/UserContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { savePersonalDetails } from "../../store/formOneSlice.js";

export default function Coformone() {
  const { user } = useContext(UserContext);
  const [numberOfApplicants, setNumberOfApplicants] = useState(1);
  const [formValuesList, setFormValuesList] = useState([
    {
      full_name: "",
      father_name: "",
      mobile_number: "",
      email_id: "",
      dob: "",
      gender: "",
      qualification: "",
      employment_type: "",
      marital_status: "",
      spouse_employment_type: "",
      no_of_dependents: "",
      pan_number: "",
      residence_type: "",
      citizenship: "",
      permanent_state: "",
      permanent_district: "",
      permanent_address: "",
      permanent_pincode: "",
      present_state: "",
      present_district: "",
      present_address: "",
      present_pincode: "",
    },
  ]);
  const [errors, setErrors] = useState([{}]); // Error state for each applicant

  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.form);

  // Handle change in the number of applicants
  const handleNumberOfApplicantsChange = (value) => {
    setNumberOfApplicants(value);
    const newFormValuesList = Array.from({ length: value }, (_, index) => ({
      ...(formValuesList[index] || {}),
      full_name: "",
      father_name: "",
      mobile_number: "",
      email_id: "",
      dob: "",
      gender: "",
      qualification: "",
      employment_type: "",
      marital_status: "",
      spouse_employment_type: "",
      no_of_dependents: "",
      pan_number: "",
      residence_type: "",
      citizenship: "",
      permanent_state: "",
      permanent_district: "",
      permanent_address: "",
      permanent_pincode: "",
      present_state: "",
      present_district: "",
      present_address: "",
      present_pincode: "",
    }));
    setFormValuesList(newFormValuesList);
    setErrors(Array(value).fill({})); // Reset errors for new number of applicants
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    setFormValuesList((prev) => {
      const updatedForms = [...prev];
      updatedForms[index] = { ...updatedForms[index], [name]: value };
      return updatedForms;
    });
    // Clear error for this field when user starts typing
    setErrors((prev) => {
      const updatedErrors = [...prev];
      updatedErrors[index] = { ...updatedErrors[index], [name]: "" };
      return updatedErrors;
    });
  };

  const handleOptionSelect = (index, name, option) => {
    setFormValuesList((prev) => {
      const updatedForms = [...prev];
      updatedForms[index][name] = option;
      return updatedForms;
    });
  };

  const validateForm = () => {
    const newErrors = formValuesList.map((formValues) => {
      const applicantErrors = {};
      if (!formValues.full_name) applicantErrors.full_name = "Please fill this field";
      if (!formValues.email_id) applicantErrors.email_id = "Please fill this field";
      if (!formValues.mobile_number) applicantErrors.mobile_number = "Please fill this field";
      return applicantErrors;
    });
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0); // True if no errors
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (!user) {
      toast.error("User not authenticated. Please log in.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const payload = {
        userId: user?.id,
        applicants: formValuesList,
      };

      const result = await dispatch(savePersonalDetails(payload)).unwrap();
      toast.success("Personal details saved successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => {
          navigate("/co-applicant-form-detail-two", {
            state: {
              numberOfApplicants,
              applicants: formValuesList,
            },
          });
        },
      });
    } catch (err) {
      console.error("Form Submission Error:", err);
      toast.error(err || "Failed to save personal details. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const getFieldProps = (index, fieldName, placeholder) => {
    return {
      name: fieldName,
      placeholder: errors[index]?.[fieldName]
        ? errors[index][fieldName] // Show error in placeholder if present
        : `${placeholder}${index > 0 ? ` (Applicant ${index + 1})` : ""}`,
      value: formValuesList[index][fieldName] || "",
      onChange: (e) => handleInputChange(index, e),
      error: errors[index]?.[fieldName], // Pass error state to Input component
    };
  };

  return (
    <div className="min-h-screen bg-[#010349f0] text-gray-900 flex flex-col lg:flex-row">
      <ToastContainer />
      <div className="absolute mt-20 md:mt-32 w-full h-1 bg-[#9ea0c5e7]"></div>
      <div className="w-full lg:w-1/4 py-10 px-4 lg:pl-16 flex flex-col shadow-xl relative rounded-r-3xl">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8 lg:mb-14 text-white tracking-wide text-center -mt-3">
          Application Process
        </h2>
        <ul className="relative mr-10">
          <div className="absolute right-6 top-12 bottom-0 w-1 bg-[#9ea0c5e7] mb-3"></div>
          <li className="flex items-center justify-end space-x-6 mb-12 lg:mb-16 cursor-pointer relative group">
            <span className="text-lg lg:text-xl font-medium text-[#26cc88] group-hover:text-[#26cc88] transition-colors text-right mt-4">
              Personal Information
              <div className="text-sm">Browse and Upload</div>
            </span>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 mt-4 flex items-center justify-center bg-[#26cc88] rounded-full text-black font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <FaUser className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
          <li className="flex items-center justify-end space-x-6 mb-12 lg:mb-16 cursor-pointer relative group">
            <span className="text-lg lg:text-xl font-medium text-white group-hover:text-[#26cc88] transition-colors text-right">
              Employment Status
              <div className="text-sm">Browse and Upload</div>
            </span>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#484a7b] rounded-full text-white font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <FaBookOpen className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
          <li className="flex items-center justify-end space-x-6 cursor-pointer relative group">
            <span className="text-lg lg:text-xl font-medium text-white group-hover:text-[#26cc88] transition-colors text-right">
              Documents
              <div className="text-sm">Browse and Upload</div>
            </span>
            <div className="z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#484a7b] rounded-full text-white font-bold shadow-lg transition-transform transform group-hover:scale-110 group-hover:rotate-6">
              <IoDocuments className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
          </li>
        </ul>
        <div className="hidden lg:block absolute top-[8rem] right-0 h-screen w-1 bg-[#b1b3d7ef]">
          <div className="absolute top-[3.5rem] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-[#26cc88] rounded-full"></div>
          <div className="absolute top-[10.5rem] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#484a7b] border-4 border-[#383a69] rounded-full"></div>
          <div className="absolute top-[17.5rem] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#484a7b] border-4 border-[#383a69] rounded-full"></div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 p-4 lg:p-10 -mt-2">
        <h1 className="text-2xl ml-12 lg:text-3xl text-white font-bold mb-3 lg:mb-3">
          Loan Application - Co-Applicant
        </h1>
        <p className="text-white ml-12 mb-6 lg:mb-11">
          Set up your account for your loan application
        </p>
        <div className="ml-12 mb-6">
          <Dropdown
            options={["1", "2", "3"]}
            placeholder="Number of Applicants"
            setOpenDropdown={setOpenDropdown}
            isOpen={openDropdown === "numberOfApplicants"}
            id="numberOfApplicants"
            value={numberOfApplicants.toString()}
            onSelect={(option) => handleNumberOfApplicantsChange(parseInt(option))}
          />
        </div>
        <form onSubmit={handleFormSubmit}>
          {formValuesList.map((formValues, index) => (
            <div
              key={index}
              className={`mx-4 lg:mx-12 p-4 rounded-xl ${
                Object.keys(errors[index] || {}).length > 0
                  ? "border-2 border-red-500"
                  : "border-2 border-transparent"
              }`}
            >
              <h1 className="text-lg lg:text-xl font-bold mt-4 lg:mt-6 text-white mb-2 lg:mb-3">
                Applicant {index + 1} Details
              </h1>
              <div className="mx-2 lg:mx-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3 lg:gap-4">
                  <Input
                    {...getFieldProps(index, "full_name", "Full Name as per Pan card")}
                  />
                  <Input {...getFieldProps(index, "father_name", "Father Name")} />
                  <Input
                    {...getFieldProps(index, "mobile_number", "Enter 10-digit mobile number")}
                  />
                  <Input {...getFieldProps(index, "email_id", "Email ID")} />
                  <Input {...getFieldProps(index, "dob", "DOB")} />
                  <Dropdown
                    options={["Male", "Female", "Other"]}
                    placeholder="Gender"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `gender-${index}`}
                    id={`gender-${index}`}
                    value={formValues.gender}
                    onSelect={(option) => handleOptionSelect(index, "gender", option)}
                  />
                  <Dropdown
                    options={[
                      "Post Graduate",
                      "Graduate",
                      "Higher Secondary",
                      "Secondary",
                      "Others",
                    ]}
                    placeholder="Qualification"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `qualification-${index}`}
                    id={`qualification-${index}`}
                    value={formValues.qualification}
                    onSelect={(option) =>
                      handleOptionSelect(index, "qualification", option)
                    }
                  />
                  <Dropdown
                    options={["Salaried", "Self Employed", "Professional", "Unemployed"]}
                    placeholder="Employment Type"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `employmentType-${index}`}
                    id={`employmentType-${index}`}
                    value={formValues.employment_type}
                    onSelect={(option) =>
                      handleOptionSelect(index, "employment_type", option)
                    }
                  />
                  <Dropdown
                    options={["Married", "Unmarried", "Other"]}
                    placeholder="Marital Status"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `maritalStatus-${index}`}
                    id={`maritalStatus-${index}`}
                    value={formValues.marital_status}
                    onSelect={(option) =>
                      handleOptionSelect(index, "marital_status", option)
                    }
                  />
                  <Dropdown
                    options={["Earning", "Home Maker"]}
                    placeholder="Spouse Employment Type ( If Married )"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `spouseEmploymentType-${index}`}
                    id={`spouseEmploymentType-${index}`}
                    value={formValues.spouse_employment_type}
                    onSelect={(option) =>
                      handleOptionSelect(index, "spouse_employment_type", option)
                    }
                  />
                  <Dropdown
                    options={["0", "1", "2", "3"]}
                    placeholder="No of Dependents"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `dependents-${index}`}
                    id={`dependents-${index}`}
                    value={formValues.no_of_dependents}
                    onSelect={(option) =>
                      handleOptionSelect(index, "no_of_dependents", option)
                    }
                  />
                  <Input {...getFieldProps(index, "pan_number", "Pan Number")} />
                  <Dropdown
                    options={["Owned", "Rented", "Parental", "Others"]}
                    placeholder="Residence Type"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `residenceType-${index}`}
                    id={`residenceType-${index}`}
                    value={formValues.residence_type}
                    onSelect={(option) =>
                      handleOptionSelect(index, "residence_type", option)
                    }
                  />
                  <Dropdown
                    options={["Resident Indian", "Non-Resident Indian"]}
                    placeholder="Citizenship"
                    setOpenDropdown={setOpenDropdown}
                    isOpen={openDropdown === `citizenship-${index}`}
                    id={`citizenship-${index}`}
                    value={formValues.citizenship}
                    onSelect={(option) =>
                      handleOptionSelect(index, "citizenship", option)
                    }
                  />
                </div>
              </div>
              <h1 className="text-lg lg:text-xl font-bold mt-4 lg:mt-6 ml-2 lg:ml-3 text-white mb-2 lg:mb-3">
                Permanent Address Details
              </h1>
              <div className="mx-4 lg:mx-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3 lg:gap-4">
                  <Input {...getFieldProps(index, "permanent_state", "State")} />
                  <Input {...getFieldProps(index, "permanent_district", "District")} />
                  <Input
                    {...getFieldProps(index, "permanent_address", "Enter Your Permanent Address")}
                  />
                  <Input {...getFieldProps(index, "permanent_pincode", "Pin Code")} />
                </div>
              </div>
              <h1 className="text-lg lg:text-xl font-bold mt-4 lg:mt-6 ml-2 lg:ml-3 text-white mb-2 lg:mb-3">
                Present Address Details
              </h1>
              <div className="mx-4 lg:mx-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-3 lg:gap-4">
                  <Input {...getFieldProps(index, "present_state", "State")} />
                  <Input {...getFieldProps(index, "present_district", "District")} />
                  <Input
                    {...getFieldProps(index, "present_address", "Enter Your Present Address")}
                  />
                  <Input {...getFieldProps(index, "present_pincode", "Pin Code")} />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 lg:mt-8 flex justify-center">
            <Button type="submit" text="Submit & Next" className="mt-4 lg:mt-6" />
          </div>
        </form>
      </div>
    </div>
  );
}