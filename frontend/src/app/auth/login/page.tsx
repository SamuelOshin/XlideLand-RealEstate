'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { Eye, EyeOff, Home, Lock, User, Building2, TrendingUp, Shield, Star } from 'lucide-react'

export default function LoginPage() {  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const success = await login(credentials)
    // Note: AuthContext now handles the redirect to intended destination
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Two-Grid Layout */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-16 bg-white">
          <div className="max-w-md w-full mx-auto">            {/* Back to Home Link */}
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
                Welcome Back
              </h1>
              <p className="text-lg text-gray-600">
                Sign in to access your premium real estate experience
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>                  
                  <input
                    id="email"
                    type="email"
                    required
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In to XlideLand'
                )}
              </button>
            </form>            {/* Divider */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <InstantLoadingLink 
                  href="/auth/register" 
                  className="font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Create your account
                </InstantLoadingLink>
              </p>
            </div>
          </div>
        </div>        {/* Right Side - Brand Image & Content */}
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
              </div>              <h2 className="text-3xl font-bold mb-2">Welcome to XlideLand</h2>
              <p className="text-xl text-green-100">Your Premium Real Estate Experience</p>
            </div>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="h-6 w-6" />
                </div>                <div>
                  <h3 className="font-semibold text-lg">Market Insights</h3>
                  <p className="text-green-100">Real-time property analytics and trends</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure Transactions</h3>
                  <p className="text-green-100">Bank-level security for all your deals</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Premium Support</h3>
                  <p className="text-green-100">24/7 dedicated customer service</p>
                </div>
              </div>
            </div>            {/* Quote */}
            <blockquote className="text-lg italic text-green-100">
              "XlideLand transformed how I buy and sell properties. The platform is simply outstanding!"
            </blockquote>
            <cite className="block mt-2 text-sm font-medium text-green-200">
              — Sarah Johnson, Top Realtor
            </cite>
          </div>
        </div>
      </div>
    </div>
  )
}
