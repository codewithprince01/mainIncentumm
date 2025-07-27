import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../contextapi/UserContext";
import DOMPurify from "dompurify";

axios.defaults.withCredentials = true;

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const { setUser } = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const validateForm = () => {
    const newErrors = {};
    const cleanPhoneNumber = sanitizeInput(formData.phoneNumber);
    const cleanPassword = sanitizeInput(formData.password);

    if (!cleanPhoneNumber || !/^\d{10}$/.test(cleanPhoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: sanitizeInput(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(`/api/users/login`, formData, {
        withCredentials: true,
      });
      
      console.log("Login response:", response.data);
      
      // Use the full user data from login response
      if (response.data.success && response.data.data.user) {
        const userData = response.data.data.user;
        console.log("Setting user in context:", userData);
        setUser(userData);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
          onClose: () => {
            navigate("/");
            // Removed window.location.reload() - this was wiping out the user context
          },
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      if (error.response?.status === 429) {
        toast.error("Too many login attempts. Please wait and try again.");
      } else {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Elements - Mobile Responsive */}
      <div className="absolute top-20 left-4 md:left-20 w-20 md:w-40 h-20 md:h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-4 md:right-20 w-32 md:w-52 h-32 md:h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-2 md:left-10 w-16 md:w-32 h-16 md:h-32 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/4 md:right-1/3 w-12 md:w-24 h-12 md:h-24 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center min-h-screen">
            
            {/* Left Side - Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center justify-center mb-4 md:mb-8">
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 md:px-6 py-2 md:py-3 shadow-lg">
                  <span className="text-blue-400 font-semibold text-xs md:text-sm tracking-wider">
                    WELCOME BACK
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome <span className="text-blue-300">To The</span>{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Realm Of
                </span>{" "}
                Modern{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Banking!
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Continue your financial journey with us. Access your account to explore 
                personalized loan options and track your applications.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">2000+</h3>
                  <p className="text-gray-300 text-sm md:text-base">Registered Users</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">₹5Cr+</h3>
                  <p className="text-gray-300 text-sm md:text-base">Amount Disbursed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">₹10L+</h3>
                  <p className="text-gray-300 text-sm md:text-base">Incentives Provided</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Welcome Back</h2>
                    <p className="text-gray-300 text-sm md:text-base">Glad you're back! Please sign in to continue.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <input
                        name="phoneNumber"
                        type="text"
                        placeholder="Enter your Mobile Number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.phoneNumber ? "border-red-500" : "border-white/20"
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      />
                      {errors.phoneNumber && <p className="text-red-400 text-sm mt-2">{errors.phoneNumber}</p>}
                    </div>
                    
                    <div>
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.password ? "border-red-500" : "border-white/20"
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      />
                      {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Sign In
                    </button>
                    
                    <div className="flex items-center justify-center my-6">
                      <div className="w-1/3 border-t border-white/20"></div>
                      <span className="mx-4 text-gray-400 font-medium">Or</span>
                      <div className="w-1/3 border-t border-white/20"></div>
                    </div>
                    
                    <p className="text-center text-gray-300">
                      Don't have an account?{" "}
                      <Link to="/signup-page" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Create Account
                      </Link>
                    </p>
                    
                    <div className="flex justify-center gap-6 text-gray-400 text-sm mt-6">
                      <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
                      <Link to="/contact-us" className="hover:text-blue-400 transition-colors">Support</Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}