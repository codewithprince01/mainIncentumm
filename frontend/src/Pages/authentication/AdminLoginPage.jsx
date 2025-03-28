import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState(""); // State for CSRF token
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch CSRF token on component mount
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
        toast.error("Unable to initialize login. Please try again later.");
      }
    };
    fetchCsrfToken();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form!");
      return;
    }
    if (!csrfToken) {
      toast.error("Security token not available. Please refresh the page.");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/admin-login`,
        formData,
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        }
      );
      toast.success("Admin login successful!", { autoClose: 2000 });
      navigate(import.meta.env.VITE_ADMIN_ROUTE_SECRET || "/admin-x7k9p2m");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Admin login failed.";
      toast.error(errorMessage, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {["phoneNumber", "password"].map((field) => (
            <div key={field} className="mb-4">
              <input
                name={field}
                type={field === "password" ? "password" : "text"}
                placeholder={field === "phoneNumber" ? "Admin Phone Number" : "Admin Password"}
                value={formData[field]}
                onChange={handleInputChange}
                className={`w-full p-3 border ${
                  errors[field] ? "border-red-500" : "border-gray-600"
                } rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={isLoading} // Disable inputs during submission
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
          <button
            type="submit"
            className={`w-full py-3 bg-blue-600 text-white font-bold rounded-lg transition ${
              isLoading || !csrfToken ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={isLoading || !csrfToken} // Disable button if loading or no token
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login as Admin"
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}