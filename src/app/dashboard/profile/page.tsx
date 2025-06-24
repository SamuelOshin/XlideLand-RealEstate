'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authAPI } from '@/lib/api'
import { PasswordChangeData } from '@/types'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  User, 
  Mail, 
  Calendar, 
  Lock, 
  Save, 
  Camera, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, updateProfile, role } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(profileData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setPasswordLoading(true)

    try {
      await authAPI.changePassword(passwordData)
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      })
      toast.success('Password changed successfully!')    } catch (err: unknown) {
      const error = err as Error
      toast.error(error.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'seller': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'buyer': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'seller': return 'Real Estate Agent'
      case 'buyer': return 'Property Buyer'
      default: return 'User'
    }
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600 text-sm mb-3">{user.email}</p>
              
              {/* Role Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(role)}`}>
                {getRoleDisplayName(role)}
              </div>

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date(user.date_joined).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  ID: {user.id}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-sm hover:shadow-md"
                  >
                    Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="first_name"
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="last_name"
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Enter your email address"
                    />
                    </div>
                </div>

                {/* Username (readonly) */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      value={user.username}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center text-white">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </div>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-sm hover:shadow-md"
                      onClick={() => {
                        setIsEditing(false)
                        setProfileData({
                          first_name: user.first_name || '',
                          last_name: user.last_name || '',
                          email: user.email || ''
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <Lock className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="old_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData((prev: PasswordChangeData) => ({ ...prev, old_password: e.target.value }))}
                      className="pl-10 pr-12 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="new_password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData((prev: PasswordChangeData) => ({ ...prev, new_password: e.target.value }))}
                      className="pl-10 pr-12 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Enter your new password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new_password_confirm" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="new_password_confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.new_password_confirm}
                      onChange={(e) => setPasswordData((prev: PasswordChangeData) => ({ ...prev, new_password_confirm: e.target.value }))}
                      className="pl-10 pr-12 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      {passwordData.new_password.length >= 8 ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      At least 8 characters long
                    </li>
                    <li className="flex items-center">
                      {passwordData.new_password && passwordData.new_password === passwordData.new_password_confirm ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      Passwords match
                    </li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  disabled={passwordLoading || !passwordData.old_password || !passwordData.new_password || !passwordData.new_password_confirm}
                  className="hover:bg-emerald-700 bg-gradient-to-r from-emerald-500 to-green-600"
                >
                  {passwordLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Changing Password...
                    </div>
                  ) : (
                    <div className="flex items-center text-white">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
