import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const hasChecked = useRef(false);
  const hasShownError = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    
    const checkAdminAuth = async () => {
      hasChecked.current = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/profile`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setAdmin(response.data.data);
          setAuthError(false);
        } else {
          throw new Error('No admin data received');
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setAuthError(true);
        
        // Only show toast once
        if (!hasShownError.current) {
          hasShownError.current = true;
          toast.error('Please log in as admin to access this page', {
            position: 'top-center',
            autoClose: 3000
          });
        }
        
        // Delay navigation to avoid multiple redirects
        setTimeout(() => {
          navigate('/admin/login', { replace: true });
        }, 100);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Checking admin authentication...</p>
        </div>
      </div>
    );
  }

  // If admin is not authenticated and there's an auth error, show access denied message
  if (!admin && authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6">Please log in as an admin to access this page</p>
          <button
            onClick={() => navigate('/admin/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // If admin is authenticated, render the protected content
  return children;
};

export default ProtectedAdminRoute; 