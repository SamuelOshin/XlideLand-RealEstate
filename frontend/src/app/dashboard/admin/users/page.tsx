'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminUserAPI } from '@/lib/api';
import { User } from '@/types/index';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  staff_users: number;
  recent_registrations: number;
}

export default function UserManagementPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadUsers();
  }, [isAuthenticated, role, router]);
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users and stats in parallel
      const [usersResponse, statsResponse] = await Promise.all([
        adminUserAPI.getAllUsers(),
        adminUserAPI.getUserStats()
      ]);
      
      setUsers(usersResponse.results);
      setUserStats(statsResponse);
    } catch (error: any) {
      console.error('Error loading users:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.trim();
    const matchesSearch = searchTerm === '' || 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = user.role || (user.is_staff ? 'admin' : 'buyer');
    const matchesRole = filterRole === 'all' || userRole === filterRole;
    
    const userStatus = user.is_active ? 'active' : 'inactive';
    const matchesStatus = filterStatus === 'all' || userStatus === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  const getRoleColor = (userRole?: string) => {
    const role = userRole || 'buyer';
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (userRole?: string) => {
    const role = userRole || 'buyer';
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'seller': return <Shield className="h-4 w-4" />;
      case 'buyer': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleStatusUpdate = async (userId: number, newStatus: 'active' | 'inactive') => {
    try {
      await adminUserAPI.toggleUserStatus(userId);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: newStatus === 'active' } : user
      ));
    } catch (error: any) {
      console.error('Error updating user status:', error);
      setError(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleRoleUpdate = async (userId: number, newRole: 'admin' | 'seller' | 'buyer') => {
    try {
      const updatedUser = await adminUserAPI.updateUser(userId, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error: any) {
      console.error('Error updating user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminUserAPI.deleteUser(userId);
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-red-600 text-lg font-medium">Failed to Load Users</div>
          <p className="text-gray-600 text-center">{error}</p>
          <Button onClick={loadUsers} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage platform users and permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="flex items-center gap-2 text-white bg-gradient-to-r from-emerald-500 to-green-600">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats?.total_users || users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {userStats?.active_users || users.filter(u => u.is_active).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userStats?.staff_users || users.filter(u => u.is_staff || u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {userStats?.inactive_users || users.filter(u => !u.is_active).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-3">              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Users will appear here as they register on the platform.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">                  {filteredUsers.map((user) => {
                    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;
                    const userRole = user.role || (user.is_staff ? 'admin' : 'buyer');
                    const userStatus = user.is_active ? 'active' : 'inactive';
                    
                    return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">
                                {fullName}
                              </div>
                              {user.is_verified && (
                                <UserCheck className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getRoleColor(userRole)} flex items-center gap-1 w-fit`}>
                          {getRoleIcon(userRole)}
                          {userRole}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(user.is_active)}>
                          {userStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Joined: {formatDate(user.joined_date || user.date_joined)}</div>
                        <div>Last: {user.last_login ? formatDateTime(user.last_login) : 'Never'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Properties: {user.properties_count || 0}</div>
                        <div>Inquiries: {user.inquiries_count || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowUserModal(true)}
                            className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.is_active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(user.id, 'inactive')}
                              className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(user.id, 'active')}
                              className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 bg-white/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Name</label>
                        <p className="font-medium">{`${selectedUser.first_name} ${selectedUser.last_name}`.trim()}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Email</label>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Phone</label>
                        <p className="font-medium">{selectedUser.phone || 'No phone provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Role</label>
                        <Badge className={getRoleColor(selectedUser.role || (selectedUser.is_staff ? 'admin' : 'buyer'))}>
                          {selectedUser.role || (selectedUser.is_staff ? 'admin' : 'buyer')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Status & Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Status & Activity</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Status</label>
                        <Badge className={getStatusColor(selectedUser.is_active)}>
                          {selectedUser.is_active ? 'active' : 'inactive'}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Verified</label>
                        <p className="font-medium">
                          {selectedUser.is_verified ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Registered</label>
                        <p className="font-medium">{formatDate(selectedUser.joined_date || selectedUser.date_joined)}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Last Active</label>
                        <p className="font-medium">
                          {selectedUser.last_login ? formatDateTime(selectedUser.last_login) : 'Never logged in'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Properties</label>
                        <p className="font-medium">{selectedUser.properties_count || 0}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Inquiries</label>
                        <p className="font-medium">{selectedUser.inquiries_count || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-600 hover:text-gray-800 bg-white border-gray-300 hover:border-gray-400 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
                  >
                    Close
                  </Button>
                  <Button>
                    Edit User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
