import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedAdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation(); // Track route changes

  const checkAdminAuth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/profile`, {
        withCredentials: true,
      });
      console.log("Admin token verified for path:", location.pathname, response.data);
      return true;
    } catch (error) {
      console.error("Token verification failed:", error.response?.data || error.message);
      document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return false;
    }
  };

  useEffect(() => {
    console.log("Checking auth for path:", location.pathname);
    checkAdminAuth().then((authenticated) => {
      setIsAuthenticated(authenticated);
    });
  }, [location.pathname]); // Re-run on route change

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Redirecting to /admin-login from:", location.pathname);
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedAdminRoute;