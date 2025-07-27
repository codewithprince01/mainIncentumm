import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contextapi/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedUserRoute = ({ children }) => {
  const { user, ready } = useContext(UserContext);
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (ready && !user && !hasRedirected) {
      setHasRedirected(true);
      toast.error('Please log in to access this page', {
        position: 'top-center',
        autoClose: 3000
      });
      navigate('/login-page', { replace: true });
    }
  }, [ready, user, navigate, hasRedirected]);

  // Show loading while checking authentication
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login message and redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
          <p className="text-gray-300 mb-6">Please log in to access this page</p>
          <button
            onClick={() => navigate('/login-page')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  return children;
};

export default ProtectedUserRoute; 