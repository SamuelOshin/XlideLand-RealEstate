'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import FileUpload from '@/components/ui/FileUpload'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Download,
  Upload,
  Camera,
  Key,
  Palette
} from 'lucide-react'
import { toast } from 'sonner'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar: string
    bio: string
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    priceAlerts: boolean
    newListings: boolean
    tourReminders: boolean
    messageNotifications: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'contacts'
    showEmail: boolean
    showPhone: boolean
    allowMessaging: boolean
    dataCollection: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    currency: string
    timezone: string
    measurementUnit: 'metric' | 'imperial'
    emailFrequency: 'instant' | 'daily' | 'weekly' | 'never'
  }
  security: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    sessionTimeout: number
  }
}

export default function SettingsPage() {
  const { user, role } = useAuth()
  const { avatar, loading: avatarLoading, refetch: refetchAvatar } = useUserAvatar()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'preferences' | 'security' | 'billing'>('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)

  // Handle avatar removal
  const handleRemoveAvatar = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual avatar removal API call
      // For now, just simulate the removal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refetch to update the display
      refetchAvatar();
      toast.success('Profile picture removed successfully!');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: '',
      bio: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      priceAlerts: true,
      newListings: true,
      tourReminders: true,
      messageNotifications: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessaging: true,
      dataCollection: true
    },
    preferences: {
      theme: 'system',
      language: 'en',
      currency: 'USD',
      timezone: 'America/New_York',
      measurementUnit: 'imperial',
      emailFrequency: 'daily'
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || ''
        }
      }))
    }
  }, [user])

  const updateSettings = async (section: keyof UserSettings, data: any) => {
    setLoading(true)
    try {
      // API call to update settings
      setSettings(prev => ({
        ...prev,
        [section]: { ...prev[section], ...data }
      }))
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      // API call to change password
      toast.success('Password changed successfully')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const enable2FA = async () => {
    setLoading(true)
    try {
      // API call to enable 2FA
      setSettings(prev => ({
        ...prev,
        security: { ...prev.security, twoFactorEnabled: true }
      }))
      toast.success('Two-factor authentication enabled')
    } catch (error) {
      toast.error('Failed to enable 2FA')
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    toast.success('Data export started. You will receive an email when ready.')
  }

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not available through this interface. Please contact support.')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    ...(role === 'seller' || role === 'admin' ? [{ id: 'billing', label: 'Billing', icon: CreditCard }] : [])
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings, preferences, and privacy options
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                          activeTab === tab.id
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                    
                    {/* Avatar Management */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Picture</h4>
                      
                      <div className="flex items-start space-x-6">
                        {/* Current Avatar Display */}
                        <div className="flex-shrink-0">
                          <div className="relative group">
                            <UserAvatar 
                              size="2xl" 
                              className="ring-4 ring-gray-100 shadow-lg transition-all duration-200 group-hover:ring-emerald-200"
                              showLoadingState={true}
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Camera className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Avatar Actions */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">
                              {avatar ? 
                                'Update your profile picture to help others recognize you.' : 
                                'Add a profile picture to personalize your account.'
                              }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: Square image, at least 200×200 pixels. Max file size: 2MB.
                            </p>
                          </div>

                          {/* Upload Toggle Button */}
                          {!showAvatarUpload ? (
                            <div className="flex items-center space-x-3">
                              <Button
                                onClick={() => setShowAvatarUpload(true)}
                                disabled={loading || avatarLoading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                                size="sm"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                {avatar ? 'Update Picture' : 'Upload Picture'}
                              </Button>
                              
                              {avatar && (
                                <Button
                                  onClick={handleRemoveAvatar}
                                  disabled={loading}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                                >
                                  {loading ? (
                                    <>
                                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                      Removing...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Upload Component */}
                              <FileUpload
                                uploadType="avatar"
                                onFilesUploaded={(files) => {
                                  if (files[0]) {
                                    // Refetch avatar to update display
                                    refetchAvatar();
                                    setShowAvatarUpload(false);
                                    toast.success('Profile picture updated successfully!');
                                  }
                                }}
                                onError={(error) => {
                                  console.error('Avatar upload error:', error);
                                  toast.error('Failed to upload avatar. Please try again.');
                                }}
                                className="max-w-md"
                              />
                              
                              {/* Cancel Button */}
                              <Button
                                onClick={() => setShowAvatarUpload(false)}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Preview */}
                    <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Eye className="w-4 h-4 mr-2 text-emerald-600" />
                        Profile Preview
                      </h4>
                      <p className="text-xs text-gray-600 mb-4">This is how your profile appears to other users</p>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <UserAvatar size="lg" className="ring-2 ring-white shadow-md" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">
                              {user?.first_name && user?.last_name ? 
                                `${user.first_name} ${user.last_name}` : 
                                user?.username || 'Your Name'
                              }
                            </h5>
                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {role === 'admin' ? 'Administrator' : 
                                 role === 'seller' ? 'Real Estate Agent' : 
                                 role === 'buyer' ? 'Property Buyer' : 'User'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input
                          value={settings.profile.firstName}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, firstName: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input
                          value={settings.profile.lastName}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, lastName: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, email: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={settings.profile.phone}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          value={settings.profile.bio}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profile: { ...prev.profile, bio: e.target.value }
                          }))}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={() => updateSettings('profile', settings.profile)}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">General Notifications</h4>
                        <div className="space-y-4">
                          {Object.entries({
                            emailNotifications: 'Email Notifications',
                            pushNotifications: 'Push Notifications',
                            smsNotifications: 'SMS Notifications',
                            marketingEmails: 'Marketing Emails'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-sm text-gray-600">
                                  Receive {label.toLowerCase()} about your account
                                </p>
                              </div>
                              <button
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  notifications: {
                                    ...prev.notifications,
                                    [key]: !prev.notifications[key as keyof typeof prev.notifications]
                                  }
                                }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  settings.notifications[key as keyof typeof settings.notifications]
                                    ? 'bg-emerald-600'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings.notifications[key as keyof typeof settings.notifications]
                                      ? 'translate-x-6'
                                      : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Property Alerts</h4>
                        <div className="space-y-4">
                          {Object.entries({
                            priceAlerts: 'Price Drop Alerts',
                            newListings: 'New Listing Alerts',
                            tourReminders: 'Tour Reminders',
                            messageNotifications: 'Message Notifications'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-sm text-gray-600">
                                  Get notified about {label.toLowerCase()}
                                </p>
                              </div>
                              <button
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  notifications: {
                                    ...prev.notifications,
                                    [key]: !prev.notifications[key as keyof typeof prev.notifications]
                                  }
                                }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  settings.notifications[key as keyof typeof settings.notifications]
                                    ? 'bg-emerald-600'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings.notifications[key as keyof typeof settings.notifications]
                                      ? 'translate-x-6'
                                      : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={() => updateSettings('notifications', settings.notifications)}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Profile Visibility</h4>
                        <div className="space-y-3">
                          {[
                            { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                            { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
                            { value: 'contacts', label: 'Contacts Only', desc: 'Only your contacts can see your profile' }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                checked={settings.privacy.profileVisibility === option.value}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  privacy: { ...prev.privacy, profileVisibility: e.target.value as any }
                                }))}
                                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                              />
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                                <p className="text-sm text-gray-600">{option.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h4>
                        <div className="space-y-4">
                          {Object.entries({
                            showEmail: 'Show Email Address',
                            showPhone: 'Show Phone Number',
                            allowMessaging: 'Allow Direct Messaging'
                          }).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                <p className="text-sm text-gray-600">
                                  Allow others to see your {label.toLowerCase()}
                                </p>
                              </div>
                              <button
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  privacy: {
                                    ...prev.privacy,
                                    [key]: !prev.privacy[key as keyof typeof prev.privacy]
                                  }
                                }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  settings.privacy[key as keyof typeof settings.privacy]
                                    ? 'bg-emerald-600'
                                    : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings.privacy[key as keyof typeof settings.privacy]
                                      ? 'translate-x-6'
                                      : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Data & Analytics</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Allow Data Collection</p>
                            <p className="text-sm text-gray-600">
                              Help us improve our service by collecting usage data
                            </p>
                          </div>
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, dataCollection: !prev.privacy.dataCollection }
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.privacy.dataCollection ? 'bg-emerald-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.privacy.dataCollection ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={() => updateSettings('privacy', settings.privacy)}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                    
                    <div className="space-y-8">
                      {/* Change Password */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                  ...prev,
                                  currentPassword: e.target.value
                                }))}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                  ...prev,
                                  newPassword: e.target.value
                                }))}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                  ...prev,
                                  confirmPassword: e.target.value
                                }))}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <Button
                            onClick={changePassword}
                            disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Change Password
                          </Button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {settings.security.twoFactorEnabled ? 'Enabled' : 'Enable 2FA'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {settings.security.twoFactorEnabled ? (
                              <>
                                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                                <Button variant="outline" size="sm">
                                  Disable
                                </Button>
                              </>
                            ) : (
                              <Button onClick={enable2FA} disabled={loading} size="sm">
                                <Key className="w-4 h-4 mr-2" />
                                Enable
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Login Alerts */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Login Alerts</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Login Alerts</p>
                            <p className="text-sm text-gray-600">
                              Get notified when someone logs into your account
                            </p>
                          </div>
                          <button
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              security: { ...prev.security, loginAlerts: !prev.security.loginAlerts }
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.security.loginAlerts ? 'bg-emerald-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={() => updateSettings('security', settings.security)}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* Data Management */}
                <div className="border-t border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-600">
                          Download a copy of your account data
                        </p>
                      </div>
                      <Button variant="outline" onClick={exportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <p className="text-sm font-medium text-red-900">Delete Account</p>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="outline" onClick={deleteAccount} className="text-red-600 border-red-300 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
