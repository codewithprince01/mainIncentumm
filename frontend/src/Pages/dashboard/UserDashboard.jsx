import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contextapi/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FiUser, 
  FiFileText, 
  FiBarChart, 
  FiSettings,
  FiLogOut,
  FiHome,
  FiEye,
  FiDownload,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiPlus
} from 'react-icons/fi';

const UserDashboard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login-page');
      return;
    }
    fetchUserApplications();
    fetchUserStats();
  }, [user, navigate]);

  // Refresh data when component becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserApplications();
        fetchUserStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchUserApplications = async () => {
    setApplicationsLoading(true);
    try {
      const response = await axios.get('/api/loan-applications/my-applications', {
        withCredentials: true
      });
      setApplications(response.data.data?.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        navigate('/login-page');
      } else {
        toast.error('Failed to load applications');
      }
      setApplications([]);
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

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, {
        withCredentials: true
      });
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      logout(); // Force logout on frontend even if backend fails
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'disbursed': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <FiXCircle className="w-4 h-4 text-red-600" />;
      case 'under_review': return <FiClock className="w-4 h-4 text-yellow-600" />;
      case 'submitted': return <FiAlertCircle className="w-4 h-4 text-blue-600" />;
      case 'disbursed': return <FiCheckCircle className="w-4 h-4 text-purple-600" />;
      default: return <FiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 min-h-screen">
          <div className="p-6">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.name || 'User'}</h3>
                <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiHome className="w-5 h-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'applications' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiFileText className="w-5 h-5" />
                <span>My Applications</span>
                {applications.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {applications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiBarChart className="w-5 h-5" />
                <span>Analytics</span>
              </button>
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'applications' && 'My Applications'}
                {activeTab === 'profile' && 'Profile Settings'}
                {activeTab === 'analytics' && 'Analytics'}
              </h1>
              <p className="text-gray-400 mt-1">
                {activeTab === 'overview' && 'Welcome back! Here\'s your loan application summary.'}
                {activeTab === 'applications' && 'Track and manage your loan applications.'}
                {activeTab === 'profile' && 'Manage your personal information and settings.'}
                {activeTab === 'analytics' && 'View your loan application insights and trends.'}
              </p>
            </div>
            <button
              onClick={() => {
                fetchUserApplications();
                fetchUserStats();
                toast.success('Data refreshed!');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Applications</p>
                      <p className="text-2xl font-bold text-white">{stats?.totalApplications || applications.length}</p>
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
                      <p className="text-2xl font-bold text-white">
                        {applications.filter(app => app.status === 'approved').length}
                      </p>
                    </div>
                    <div className="p-3 bg-green-600 rounded-lg">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-white">
                        {applications.filter(app => ['submitted', 'under_review'].includes(app.status)).length}
                      </p>
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
                      <p className="text-2xl font-bold text-white">
                        ₹{applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-600 rounded-lg">
                      <FiDollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          navigate(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="appearance-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 pr-8 rounded-lg transition-colors cursor-pointer"
                    >
                      <option value="">+ New Application</option>
                      <option value="/home-loan-application">Home Loan</option>
                      <option value="/personal-loan-application">Personal Loan</option>
                      <option value="/vehicle-loan-application">Vehicle Loan</option>
                      <option value="/business-loan-application">Business Loan</option>
                    </select>
                    <FiPlus className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div className="p-6">
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FiFileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {app.loanType.charAt(0).toUpperCase() + app.loanType.slice(1)} Loan
                              </h3>
                              <p className="text-gray-400 text-sm">₹{app.loanAmount?.toLocaleString()}</p>
                              <p className="text-gray-500 text-xs">{app.applicationId}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                              {app.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <button className="text-blue-400 hover:text-blue-300">
                              <FiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Applications Yet</h3>
                      <p className="text-gray-400 mb-4">Start your loan journey by applying for a loan.</p>
                      <button
                        onClick={() => navigate('/loan-application')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Apply for Loan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Applications</h2>
                <button
                  onClick={() => navigate('/loan-application')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>New Application</span>
                </button>
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
                              {app.loanType.charAt(0).toUpperCase() + app.loanType.slice(1)}
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
                                <button 
                                  onClick={() => navigate('/loan-application')}
                                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
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
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-white">
                      {user?.name || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-white">
                      {user?.email || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-white">
                      {user?.phoneNumber || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg text-white">
                      {user?.pincode || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Application Analytics</h2>
                <div className="text-center py-8">
                  <FiTrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-400">Detailed insights about your loan applications will be available soon.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 