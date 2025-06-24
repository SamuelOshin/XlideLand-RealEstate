'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { Eye, EyeOff, Home, Lock, User, Mail, UserPlus, Building2, TrendingUp, Shield, Users, Award, CheckCircle } from 'lucide-react'

export default function RegisterPage() {  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    role: 'buyer' as 'buyer' | 'seller'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.password_confirm) {
      alert('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    
    const success = await register(formData)
    // Note: AuthContext now handles the redirect to intended destination
    
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Two-Grid Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        
        {/* Left Side - Register Form */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-16 bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Back to Home Link */}
            <div className="mb-8">
              <InstantLoadingLink 
                href="/" 
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group"
              >
                <Home className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to XlideLand</span>
              </InstantLoadingLink>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Join XlideLand
              </h1>
              <p className="text-lg text-gray-600">
                Create your account and unlock premium real estate features
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="john@example.com"
                  />                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                      formData.role === 'buyer' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('role', 'buyer')}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={formData.role === 'buyer'}
                      onChange={() => handleInputChange('role', 'buyer')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Users className={`h-6 w-6 ${formData.role === 'buyer' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <div className={`font-semibold ${formData.role === 'buyer' ? 'text-green-900' : 'text-gray-900'}`}>
                          Buyer
                        </div>
                        <div className="text-sm text-gray-600">
                          Find your dream property
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                      formData.role === 'seller' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('role', 'seller')}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={formData.role === 'seller'}
                      onChange={() => handleInputChange('role', 'seller')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Building2 className={`h-6 w-6 ${formData.role === 'seller' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div>
                        <div className={`font-semibold ${formData.role === 'seller' ? 'text-green-900' : 'text-gray-900'}`}>
                          Seller/Agent
                        </div>
                        <div className="text-sm text-gray-600">
                          List and sell properties
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password_confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.password_confirm}
                      onChange={(e) => handleInputChange('password_confirm', e.target.value)}
                      className="block w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Create My Account
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <InstantLoadingLink 
                  href="/auth/login" 
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Sign in here
                </InstantLoadingLink>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Brand Content */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute top-32 right-20 w-20 h-20 border border-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-lg text-center">
            {/* Brand Logo/Icon */}
            <div className="mb-8">
              <div className="mx-auto w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Start Your Journey</h2>
              <p className="text-xl text-green-100">Join thousands of successful real estate professionals</p>
            </div>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">50K+ Active Users</h3>
                  <p className="text-green-100">Join our thriving community of real estate professionals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Award-Winning Platform</h3>
                  <p className="text-green-100">Recognized as the #1 real estate platform for 3 years</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">100% Free to Start</h3>
                  <p className="text-green-100">No hidden fees, no credit card required</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">$2.5B+</div>
                <div className="text-sm text-green-200">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-green-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-green-200">Support</div>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-lg italic text-green-100">
              "The tools and insights on XlideLand helped me close 40% more deals this year!"
            </blockquote>
            <cite className="block mt-2 text-sm font-medium text-green-200">
              — Michael Chen, Real Estate Agent
            </cite>
          </div>
        </div>
      </div>
    </div>
  )
}
