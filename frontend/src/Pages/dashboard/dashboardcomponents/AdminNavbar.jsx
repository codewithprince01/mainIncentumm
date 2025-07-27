import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/logo.webp";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/csrf-token`, {
          withCredentials: true,
        });
        setCsrfToken(response.data.csrfToken);
        console.log("CSRF token fetched for AdminNavbar:", response.data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token:", err.response?.data || err.message);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    if (!csrfToken) {
      toast.error("Security token not available. Please refresh the page.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/admin-logout`,
        {},
        {
          withCredentials: true,
          headers: { "X-CSRF-Token": csrfToken },
        }
      );
      // Clear adminToken cookie client-side as a fallback
      document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success("Admin logged out successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/admin-login"),
      });
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Logout failed", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <header className="bg-primary py-2 px-6 flex justify-between items-center relative shadow-lg">
      {/* Logo */}
      <div className="text-white font-bold text-xl flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
        <Link to={import.meta.env.VITE_ADMIN_ROUTE_SECRET || "/admin-x7k9p2m"}>
          <img src={logo} alt="Rupee Icon" className="w-[130px] h-[60px]" />
        </Link>
      </div>

      {/* Hamburger Menu Button */}
      <button
        className="text-white text-2xl md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navbar */}
      <nav
        className={`absolute top-0 left-0 w-full bg-primary flex flex-col items-start p-4 space-y-4 md:hidden transform transition-transform duration-500 z-50 ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          className="self-end text-white text-2xl mb-4"
          onClick={toggleMobileMenu}
        >
          <FaTimes />
        </button>
        <Link
          to={import.meta.env.VITE_ADMIN_ROUTE_SECRET || "/admin-x7k9p2m"}
          className="text-white hover:text-auButtomColor transition"
          onClick={toggleMobileMenu}
        >
          Dashboard
        </Link>
        <Link
          to="/client-application"
          className="text-white hover:text-auButtomColor transition"
          onClick={toggleMobileMenu}
        >
          Client Applications
        </Link>
        <button
          onClick={handleLogout}
          className="text-white hover:text-auButtomColor transition"
        >
          Logout
        </button>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center space-x-6 text-lg">
        <Link
          to={import.meta.env.VITE_ADMIN_ROUTE_SECRET || "/admin-x7k9p2m"}
          className="text-white hover:text-auButtomColor transition hover:scale-110 duration-300"
        >
          Dashboard
        </Link>
        <Link
          to="/client-application"
          className="text-white hover:text-auButtomColor transition hover:scale-110 duration-300"
        >
          Client Applications
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="flex gap-2 border bg-yellow-300 border-gray-300 rounded-full py-1 px-3 text-black font-semibold hover:bg-yellow-200 transition hover:scale-105 duration-300"
          >
            Admin
          </button>
          {showLogout && (
            <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg z-50 w-32 transition-opacity duration-300">
              <button
                onClick={handleLogout}
                className="flex w-full gap-2 items-center text-left px-3 py-2 text-gray-800 hover:bg-auColor hover:text-white rounded-lg transition-all duration-300"
              >
                <IoArrowBackCircleSharp className="w-6 h-6" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <ToastContainer position="top-center" autoClose={2000} />
    </header>
  );
};

export default AdminNavbar;