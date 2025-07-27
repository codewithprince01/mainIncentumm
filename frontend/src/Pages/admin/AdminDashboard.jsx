import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEye, FiEdit, FiSearch, FiRefreshCw, FiHome, FiFileText, FiSettings, FiLogOut, FiUser, FiUsers, FiDollarSign, FiDownload, FiTrash2, FiShield, FiDatabase, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalLoanAmount: 0
  });
  const navigate = useNavigate();

  // Check admin authentication status
  const checkAuthStatus = async () => {
    try {
      console.log('Checking admin auth status...');
      const response = await axios.get('/api/admin/profile', {
        withCredentials: true
      });
      console.log('Admin auth check successful:', response.data);
      alert('Admin authentication is working! Admin: ' + response.data.data.name);
    } catch (error) {
      console.error('Admin auth check failed:', error);
      alert('Admin authentication failed: ' + (error.response?.data?.message || error.message));
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      console.log('Fetching users...');
      
      const response = await axios.get('/api/admin/users', {
        withCredentials: true,
        params: {
          limit: 100,
          page: 1
        }
      });
      
      console.log('Users response:', response.data);
      const usersList = response.data.data.users || [];
      setUsers(usersList);
      
      console.log('Successfully loaded users:', usersList.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        console.error('Authentication failed');
      }
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, []);

  // Auto-fetch users when Users tab is accessed
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log('Fetching applications with credentials...');
      
      // First, get the first page to determine total count
      const firstResponse = await axios.get('/api/admin/applications', {
        withCredentials: true,
        params: {
          limit: 100, // Try to get more apps in first request
          page: 1
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Applications response:', firstResponse.data);
      let allApps = firstResponse.data.data.applications || [];
      const totalApplications = firstResponse.data.data.totalApplications || 0;
      const totalPages = firstResponse.data.data.totalPages || 1;
      
      // If there are more pages, fetch them too
      if (totalPages > 1) {
        console.log(`Fetching remaining ${totalPages - 1} pages...`);
        for (let page = 2; page <= totalPages; page++) {
          try {
            const response = await axios.get('/api/admin/applications', {
              withCredentials: true,
              params: {
                limit: 100,
                page: page
              },
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const moreApps = response.data.data.applications || [];
            allApps = [...allApps, ...moreApps];
          } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
          }
        }
      }
      
      setApplications(allApps);
      
      // Calculate stats
      const totalAmount = allApps.reduce((sum, app) => sum + (app.loanAmount || 0), 0);
      const approved = allApps.filter(app => app.status === 'approved').length;
      const pending = allApps.filter(app => ['submitted', 'under_review'].includes(app.status)).length;
      const rejected = allApps.filter(app => app.status === 'rejected').length;
      
      setStats({
        totalApplications: allApps.length,
        approved,
        pending,
        rejected,
        totalLoanAmount: totalAmount
      });
      
      console.log(`Successfully loaded ${allApps.length} applications out of ${totalApplications} total`);
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed - redirecting to login');
        // Show error message
        if (window.confirm('Authentication failed. Would you like to go back to login?')) {
          navigate('/admin/login');
        }
      } else {
        console.error('Other error occurred:', error.message);
      }
      
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    // Open view in new tab
    const url = `/admin/application/${application._id || application.applicationId}`;
    window.open(url, '_blank');
  };

  const handleEditApplication = (application) => {
    // Open edit in new tab  
    const url = `/admin/application/${application._id || application.applicationId}`;
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    fetchApplications();
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout', {}, {
        withCredentials: true
      });
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/admin-login');
    }
  };

  const filteredApplications = applications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.applicationId?.toLowerCase().includes(searchLower) ||
      app.userId?.name?.toLowerCase().includes(searchLower) ||
      app.userId?.email?.toLowerCase().includes(searchLower) ||
      app.loanType?.toLowerCase().includes(searchLower)
    );
  });

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
            {/* Admin Profile Section */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Admin Panel</h3>
                <p className="text-gray-400 text-sm">Administrator</p>
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
                <span>Applications</span>
                {applications.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {applications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiUsers className="w-5 h-5" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
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
                {activeTab === 'overview' && 'Admin Overview'}
                {activeTab === 'applications' && 'Loan Applications'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-400 mt-1">
                {activeTab === 'overview' && 'Welcome to the admin dashboard. Here\'s your system overview.'}
                {activeTab === 'applications' && 'Manage and review all loan applications.'}
                {activeTab === 'users' && 'Manage user accounts and permissions.'}
                {activeTab === 'settings' && 'Configure system settings and preferences.'}
              </p>
            </div>
            <button
              onClick={handleRefresh}
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
                      <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
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
                      <p className="text-2xl font-bold text-white">{stats.approved}</p>
                    </div>
                    <div className="p-3 bg-green-600 rounded-lg">
                      <FiFileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Pending</p>
                      <p className="text-2xl font-bold text-white">{stats.pending}</p>
                    </div>
                    <div className="p-3 bg-yellow-600 rounded-lg">
                      <FiFileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-2xl font-bold text-white">₹{stats.totalLoanAmount.toLocaleString()}</p>
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
                  <button
                    onClick={checkAuthStatus}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Test Auth
                  </button>
                </div>
                <div className="p-6">
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app) => (
                        <div key={app._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FiFileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{app.applicationId}</h3>
                              <p className="text-gray-400 text-sm">{app.userId?.name} - {app.loanType}</p>
                              <p className="text-gray-500 text-xs">₹{app.loanAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {app.status || 'Submitted'}
                            </span>
                            <button 
                              onClick={() => handleViewApplication(app)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No Applications</h3>
                      <p className="text-gray-400">No loan applications have been submitted yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h2 className="text-lg font-medium text-white">
                    Loan Applications ({filteredApplications.length})
                  </h2>
                </div>
                
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <FiFileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No applications found</p>
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
                            User
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
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {filteredApplications.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                              {app.applicationId || app._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div>
                                <div className="font-medium text-white">{app.userId?.name || 'N/A'}</div>
                                <div className="text-gray-400">{app.userId?.email || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                              {app.loanType || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              ₹{(app.loanAmount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {app.status || 'Submitted'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewApplication(app)}
                                  className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                                  title="View Application"
                                >
                                  <FiEye className="w-3 h-3 mr-1" />
                                  View
                                </button>
                                <button 
                                  onClick={() => handleEditApplication(app)}
                                  className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                  title="Edit Application"
                                >
                                  <FiEdit className="w-3 h-3 mr-1" />
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Users Management</h2>
                <button
                  onClick={fetchUsers}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  <span>Load Users</span>
                </button>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                  <h2 className="text-lg font-medium text-white">
                    Registered Users ({users.length})
                  </h2>
                </div>
                
                {usersLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUsers className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Users Found</h3>
                                         <p className="text-gray-400">Click &ldquo;Load Users&rdquo; to fetch user data.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Pincode
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Registered Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {users.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-700/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="font-medium text-white">{user.name || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.email || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.phoneNumber || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {user.pincode || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiDatabase className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-300">Database Status</p>
                        <p className="text-lg font-bold text-white">Operational</p>
                      </div>
                    </div>
                    <FiShield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-300">Email Service</p>
                        <p className="text-lg font-bold text-white">Active</p>
                      </div>
                    </div>
                    <FiShield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiDownload className="w-6 h-6 text-teal-400" />
                      <div>
                        <p className="text-sm text-gray-300">Data Export</p>
                        <p className="text-lg font-bold text-white">Available</p>
                      </div>
                    </div>
                    <FiShield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiTrash2 className="w-6 h-6 text-red-400" />
                      <div>
                        <p className="text-sm text-gray-300">Data Purge</p>
                        <p className="text-lg font-bold text-white">Coming Soon</p>
                      </div>
                    </div>
                    <FiShield className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Application Management */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Application Management</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Auto Application Processing</h3>
                      <p className="text-sm text-gray-400">Automatically process applications based on criteria</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Send email updates to applicants</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div>
                      <h3 className="text-white font-medium">Document Verification</h3>
                      <p className="text-sm text-gray-400">Require manual document verification</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Admin Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <FiDownload className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Export All Applications</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                    <FiMail className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Send Bulk Notifications</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    <FiUsers className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Manage User Roles</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                    <FiDatabase className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Database Backup</span>
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Security & Compliance</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Session Timeout</h3>
                    <select className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white">
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="480" selected>8 hours</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Password Policy</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>✅ Minimum 8 characters</p>
                      <p>✅ Require special characters</p>
                      <p>✅ Require numbers</p>
                      <p>✅ Session expiry enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 