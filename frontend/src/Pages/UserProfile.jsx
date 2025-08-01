import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contextapi/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiSettings, 
  FiFileText, 
  FiBarChart, 
  FiEdit, 
  FiSave, 
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiEye,
  FiDownload
} from 'react-icons/fi';

const UserProfile = () => {
  const { user, refreshUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});



  useEffect(() => {
    fetchUserApplications();
    fetchUserStats();
  }, []);

  const fetchUserApplications = async () => {
    setApplicationsLoading(true);
    try {
      const response = await axios.get('/api/loan-applications/my-applications', {
        withCredentials: true
      });
      setApplications(response.data.data?.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
      toast.error('Failed to load applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/loan-applications/stats', {
        withCredentials: true
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalApplications: 0,
        approved: 0,
        pending: 0,
        underReview: 0,
        rejected: 0,
        totalLoanAmount: 0,
        avgProcessingTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      pincode: user?.pincode || ''
    });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        '/users/profile',
        editData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        refreshUser();
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditData({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'under_review': return <FiClock className="w-4 h-4" />;
      case 'submitted': return <FiFileText className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 py-4 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-white">{user?.name || 'Demo User'}</h1>
                <p className="text-gray-300 text-sm md:text-base">{user?.email || 'demo@example.com'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchUserApplications}
                className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm md:text-base"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Sidebar */}
          <div className="lg:w-64 w-full">
            <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {/* Overview tab disabled for regular users */}
              {false && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap lg:w-full ${
                    activeTab === 'overview' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <FiBarChart className="w-4 md:w-5 h-4 md:h-5" />
                  <span className="text-sm md:text-base">Overview</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap lg:w-full ${
                  activeTab === 'applications' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiFileText className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">My Applications</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap lg:w-full ${
                  activeTab === 'profile' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiUser className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap lg:w-full ${
                  activeTab === 'settings' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiSettings className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">Settings</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Tab - Disabled for regular users */}
            {false && activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Overview</h2>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Applications</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalApplications || 0}</p>
                      </div>
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <FiFileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Approved</p>
                        <p className="text-2xl font-bold text-white">{stats?.approved || 0}</p>
                      </div>
                      <div className="p-3 bg-green-600 rounded-lg">
                        <FiCheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Under Review</p>
                        <p className="text-2xl font-bold text-white">{stats?.underReview || 0}</p>
                      </div>
                      <div className="p-3 bg-yellow-600 rounded-lg">
                        <FiClock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Total Amount</p>
                        <p className="text-2xl font-bold text-white">₹{stats?.totalLoanAmount?.toLocaleString() || 0}</p>
                      </div>
                      <div className="p-3 bg-purple-600 rounded-lg">
                        <FiDollarSign className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <FiFileText className="w-5 h-5" />
                      <span>New Application</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                      <FiDownload className="w-5 h-5" />
                      <span>Download Reports</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl text-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                      <FiSettings className="w-5 h-5" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">My Applications</h2>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                  {applicationsLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Application ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Loan Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Applied Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {applications.length > 0 ? applications.map((app) => (
                            <tr key={app._id} className="hover:bg-slate-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {app.applicationId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {app.loanType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                ₹{app.loanAmount?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                                  {getStatusIcon(app.status)}
                                  <span className="ml-1">{app.status.replace('_', ' ').toUpperCase()}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(app.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <button className="text-blue-400 hover:text-blue-300 mr-3" title="View Details">
                                  <FiEye className="w-4 h-4" />
                                </button>
                                <button className="text-green-400 hover:text-green-300" title="Download">
                                  <FiDownload className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center space-y-4">
                                  <FiFileText className="w-12 h-12 text-gray-500" />
                                  <div>
                                    <p className="text-lg font-medium">No Applications Yet</p>
                                    <p className="text-sm">You haven't submitted any loan applications yet.</p>
                                  </div>
                                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                    Apply for Loan
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  {!editMode && (
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiUser className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-white">{user?.name || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiMail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-white">{user?.email || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiPhone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={editData.phoneNumber}
                            onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-white">{user?.phoneNumber || 'Not specified'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          <FiMapPin className="w-4 h-4 inline mr-2" />
                          PIN Code
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.pincode}
                            onChange={(e) => setEditData({...editData, pincode: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-white">{user?.pincode || 'Not specified'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex items-center text-sm text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {editMode && (
                    <div className="mt-6 flex items-center space-x-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <FiSave className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Account Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-400">Receive updates about your applications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-400">Receive SMS updates for important events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 