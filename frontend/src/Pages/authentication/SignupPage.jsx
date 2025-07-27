import React, { useState } from "react";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pincode: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !/^[A-Za-z]+( [A-Za-z]+)*$/.test(formData.name.trim())) {
      newErrors.name = "Name must contain alphabets only and up to 32 characters.";
    } else if (formData.name.trim().length > 32) {
      newErrors.name = "Name must not exceed 32 characters.";
    }

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    if (
      !formData.password ||
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 6 characters long and include both letters and numbers.";
    }

    if (formData.password !== formData.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all the fields correctly!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(`/api/users/register`, formData, {
        withCredentials: true, // Keep cookies for session
      });
      toast.success("Registration successful!", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login-page");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed! Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
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

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/3 w-24 h-24 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center justify-center mb-8">
                <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 shadow-lg">
                  <span className="text-blue-400 font-semibold text-sm tracking-wider">
                    JOIN INCENTUM
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome <span className="text-blue-300">To The</span>{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Realm Of
                </span>{" "}
                Modern{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Banking!
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Start your journey with India's most trusted financial partner. 
                Join thousands of satisfied customers who've achieved their financial goals.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-2">2000+</h3>
                  <p className="text-gray-300">Registered Users</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-2">₹5Cr+</h3>
                  <p className="text-gray-300">Amount Disbursed</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:scale-105 transition-transform duration-300">
                  <h3 className="text-3xl font-bold text-white mb-2">₹10L+</h3>
                  <p className="text-gray-300">Incentives Provided</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                    <p className="text-gray-300">Join thousands of satisfied customers</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          name="name"
                          type="text"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/10 border ${
                            errors.name ? "border-red-500" : "border-white/20"
                          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <input
                          name="phoneNumber"
                          type="text"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/10 border ${
                            errors.phoneNumber ? "border-red-500" : "border-white/20"
                          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                        />
                        {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.email ? "border-red-500" : "border-white/20"
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <input
                        name="pincode"
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-white/10 border ${
                          errors.pincode ? "border-red-500" : "border-white/20"
                        } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      />
                      {errors.pincode && <p className="text-red-400 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/10 border ${
                            errors.password ? "border-red-500" : "border-white/20"
                          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                        />
                        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <input
                          name="confirmpassword"
                          type="password"
                          placeholder="Confirm Password"
                          value={formData.confirmpassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-white/10 border ${
                            errors.confirmpassword ? "border-red-500" : "border-white/20"
                          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                        />
                        {errors.confirmpassword && <p className="text-red-400 text-sm mt-1">{errors.confirmpassword}</p>}
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Create Account
                    </button>
                    
                    <div className="flex items-center justify-center my-6">
                      <div className="w-1/3 border-t border-white/20"></div>
                      <span className="mx-4 text-gray-400 font-medium">Or</span>
                      <div className="w-1/3 border-t border-white/20"></div>
                    </div>
                    
                    <p className="text-center text-gray-300">
                      Already have an account?{" "}
                      <Link to="/login-page" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Sign In
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
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}