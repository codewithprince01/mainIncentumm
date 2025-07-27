import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaBars, FaTimes, FaHome, FaInfoCircle, FaCalculator, FaPhoneAlt, FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { MdAccountBalance, MdDirectionsCar, MdPerson, MdBusiness, MdHome } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "../../assets/logo.webp";
import { UserContext } from "../../contextapi/UserContext";

const Header = () => {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, setUser, ready } = useContext(UserContext);
  const navigate = useNavigate();
  const servicesDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    console.log("User in Header:", user);
    const handleClickOutside = (event) => {
      if (event.target.closest(".user-profile-dropdown") === null) {
        setShowLogout(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user]);

  if (!ready) return null;

  const toggleServicesDropdown = () => setIsServicesDropdownOpen(!isServicesDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        '/api/users/logout',
        {},
        { withCredentials: true }
      );
      console.log("Logout Response:", response.data);

      localStorage.removeItem("token");
      setUser(null);

      toast.success("Logout successful!", {
        position: "top-center",
        autoClose: 2000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/");
    } catch (err) {
      console.error("Logout Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.status === 500
          ? "Server error during logout. Please try again."
          : err.response?.data?.message || "Logout failed";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleServiceClick = (path) => {
    navigate(path);
    setIsServicesDropdownOpen(false);
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  const userName = user?.data?.name || user?.name || "User";

  const serviceItems = [
    { name: "Home Loan", path: "/home-loan", icon: <MdHome className="w-5 h-5" />, color: "text-blue-500" },
    { name: "Vehicle Loan", path: "/vehicle-loan", icon: <MdDirectionsCar className="w-5 h-5" />, color: "text-green-500" },
    { name: "Personal Loan", path: "/personal-loan", icon: <MdPerson className="w-5 h-5" />, color: "text-purple-500" },
    { name: "Business Loan", path: "/business-loan", icon: <MdBusiness className="w-5 h-5" />, color: "text-orange-500" },
    { name: "Mortgage Loan", path: "/mortgage-loan", icon: <MdAccountBalance className="w-5 h-5" />, color: "text-red-500" },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20' 
          : 'bg-gradient-to-r from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-xl'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo Section */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Incentum Financial" className="w-32 h-14 object-contain" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 font-medium transition-all duration-300 hover:scale-105 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/about-us"
              className={`flex items-center space-x-2 font-medium transition-all duration-300 hover:scale-105 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
            >
              <FaInfoCircle className="w-4 h-4" />
              <span>About</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={toggleServicesDropdown}
                className={`flex items-center space-x-2 font-medium transition-all duration-300 ${
                  scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
                }`}
              >
                <span>Services</span>
                <motion.div
                  animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown className="w-3 h-3" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 w-64 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-600/50 overflow-hidden"
                  >
                    <div className="p-2">
                      {serviceItems.map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.path}
                            onClick={() => handleServiceClick(item.path)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600/50 transition-all duration-300 group"
                          >
                            <div className={`${item.color} group-hover:scale-110 transition-transform duration-300`}>
                              {item.icon}
                            </div>
                            <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                              {item.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/emi-calculator"
              className={`flex items-center space-x-2 font-medium transition-all duration-300 hover:scale-105 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
            >
              <FaCalculator className="w-4 h-4" />
              <span>EMI Calculator</span>
            </Link>

            <Link
              to="/contact-us"
              className={`flex items-center space-x-2 font-medium transition-all duration-300 hover:scale-105 ${
                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-300'
              }`}
            >
              <FaPhoneAlt className="w-4 h-4" />
              <span>Contact</span>
            </Link>

            {/* User Profile or Get Started Button */}
            {user ? (
              <div className="relative user-profile-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowLogout(!showLogout)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
                >
                  <FaUserCircle className="w-5 h-5" />
                  <span className="font-medium">{userName}</span>
                </motion.button>

                <AnimatePresence>
                  {showLogout && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-48 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-600/50 overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          to="/user-profile"
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-600/50 transition-all duration-300 group"
                        >
                          <FaUser className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                            Profile
                          </span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all duration-300 group w-full text-left"
                        >
                          <FaSignOutAlt className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-white font-medium group-hover:text-red-300 transition-colors duration-300">
                            Logout
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup-page"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/20"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <FaHome className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </Link>

                <Link
                  to="/about-us"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <FaInfoCircle className="w-5 h-5" />
                  <span className="font-medium">About</span>
                </Link>

                {/* Mobile Services */}
                <div className="space-y-1">
                  <button
                    onClick={toggleServicesDropdown}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                  >
                    <span className="font-medium">Services</span>
                    <motion.div
                      animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isServicesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-4 space-y-1"
                      >
                        {serviceItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => handleServiceClick(item.path)}
                            className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 text-gray-600 hover:text-blue-600"
                          >
                            <div className={item.color}>{item.icon}</div>
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/emi-calculator"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <FaCalculator className="w-5 h-5" />
                  <span className="font-medium">EMI Calculator</span>
                </Link>

                <Link
                  to="/contact-us"
                  onClick={toggleMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                >
                  <FaPhoneAlt className="w-5 h-5" />
                  <span className="font-medium">Contact</span>
                </Link>

                {/* Mobile User Actions */}
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        to="/user-profile"
                        onClick={toggleMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 text-gray-700 hover:text-blue-600"
                      >
                        <FaUser className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 text-gray-700 hover:text-red-600 w-full text-left"
                      >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/signup-page"
                      onClick={toggleMobileMenu}
                      className="flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </motion.header>
  );
};

export default Header;