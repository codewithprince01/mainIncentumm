import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // null indicates "not fetched yet"
  const [ready, setReady] = useState(false);

  // Mock user for testing (only in development)
  const mockUser = {
    id: 'mock_user_123',
    name: 'Demo User',
    email: 'demo@incentum.com',
    phoneNumber: '9876543210',
    pincode: '123456',
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile from backend...');
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/profile`, {
          withCredentials: true, // Send JWT cookie
        });
        console.log("Profile response:", response.data); // Debug log
        
        // Check if response is successful
        if (response.data.success && response.data.data) {
          console.log('Successfully fetched user profile:', response.data.data);
          setUser(response.data.data);
        } else {
          console.warn('Profile response format unexpected:', response.data);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error.response?.status, error.response?.data?.message || error.message);
        
        // Only log user out if it's a proper authentication error
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Authentication failed - user not logged in');
          setUser(null);
        } else if (error.response?.status >= 500) {
          // Server error - don't log user out, keep current state
          console.warn('Server error during profile fetch - keeping current auth state');
          setUser(null); // Still set to null for safety
        } else {
          // Network error or other issues
          console.warn('Network/other error during profile fetch:', error.message);
          
          // In development, check if mock user is enabled via localStorage
          const useMockUser = localStorage.getItem('incentum_use_mock_user') === 'true';
          if (import.meta.env.DEV && useMockUser) {
            console.log('Using mock user for development testing');
            setUser(mockUser);
          } else {
            setUser(null);
          }
        }
      } finally {
        setReady(true); // Mark as ready regardless of success/failure
      }
    };

    // Only fetch if user is not already set (e.g., from login)
    if (!user) {
      console.log('No user in context, fetching from backend...');
      fetchUserProfile();
    } else {
      console.log('User already set in context:', user);
      setReady(true);
    }
  }, []); // Empty dependency array for mount-only fetch

  // Function to manually refresh user data
  const refreshUser = async () => {
    setReady(false);
    try {
      console.log('Manually refreshing user profile...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/users/profile`, {
        withCredentials: true,
      });
      if (response.data.success && response.data.data) {
        console.log('Successfully refreshed user profile:', response.data.data);
        setUser(response.data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user profile:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setReady(true);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, ready, refreshUser }}>
      {ready ? children : <div className="flex items-center justify-center min-h-screen">Loading...</div>}
    </UserContext.Provider>
  );
}