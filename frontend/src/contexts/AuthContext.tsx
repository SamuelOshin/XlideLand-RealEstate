'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, UserProfile, LoginCredentials, RegisterData } from '@/types/index'
import { authAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type UserRole = 'buyer' | 'seller' | 'admin'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  role: UserRole
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Get role from user profile, with fallback logic
  const getUserRole = (profile: UserProfile | null, user: User | null): UserRole => {
    // First priority: Use role from UserProfile if available
    if (profile?.role) {
      return profile.role
    }
    
    // Fallback: Check Django's built-in staff/superuser fields if user data includes them
    if (user && 'is_staff' in user && (user as any).is_staff) {
      return 'admin'
    }
    
    // Legacy fallback logic for backward compatibility
    if (user) {
      if (user.username.includes('admin') || user.email.includes('admin')) {
        return 'admin'
      }
      if (user.first_name?.toLowerCase().includes('agent') || 
          user.last_name?.toLowerCase().includes('agent') ||
          user.email.includes('realtor') || 
          user.email.includes('agent')) {
        return 'seller'
      }
    }
    
    return 'buyer'
  }

  const role = getUserRole(userProfile, user)
  const isAuthenticated = !!user
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          // Fetch both user data and profile with role
          const [userData, profileData] = await Promise.all([
            authAPI.getUserProfile(),
            authAPI.getUserProfileWithRole().catch(() => null) // Fallback if profile endpoint fails
          ])
          
          setUser(userData)
          setUserProfile(profileData)
          
          console.log('Auth check success:', { userData, profileData, role: profileData?.role })
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])
  
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true)
      const tokenResponse = await authAPI.login(credentials)
      
      // Store tokens
      localStorage.setItem('access_token', tokenResponse.access)
      localStorage.setItem('refresh_token', tokenResponse.refresh)
      
      // Get user data and profile with role
      const [userData, profileData] = await Promise.all([
        authAPI.getUserProfile(),
        authAPI.getUserProfileWithRole().catch(() => null)
      ])
      
      setUser(userData)
      setUserProfile(profileData)
      
      console.log('Login success:', { userData, profileData, role: profileData?.role })
      
      // Get the stored redirect URL or default to dashboard
      const redirectUrl = localStorage.getItem('auth_redirect') || '/dashboard'
      localStorage.removeItem('auth_redirect') // Clean up

      // Successfully authenticated, redirect to intended destination
      router.push(decodeURIComponent(redirectUrl))
      
      toast.success('Welcome back!')
      return true
    } catch (error: any) {
      console.error('Login failed:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      await authAPI.register(data)
        // Auto-login after registration (without redirect since we'll handle it here)
      const tokenResponse = await authAPI.login({
        email: data.email,
        password: data.password
      })
      
      // Store tokens
      localStorage.setItem('access_token', tokenResponse.access)
      localStorage.setItem('refresh_token', tokenResponse.refresh)
      
      // Get both user data and profile with role
      const [userData, profileData] = await Promise.all([
        authAPI.getUserProfile(),
        authAPI.getUserProfileWithRole().catch(() => null) // Fallback if profile endpoint fails
      ])
      
      setUser(userData)
      setUserProfile(profileData)
      
      console.log('Registration success:', { userData, profileData, role: profileData?.role })
      
      // Get the stored redirect URL or default to dashboard
      const redirectUrl = localStorage.getItem('auth_redirect') || '/dashboard'
      localStorage.removeItem('auth_redirect') // Clean up

      // Successfully authenticated, redirect to intended destination
      router.push(decodeURIComponent(redirectUrl))
      
      toast.success('Account created successfully!')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
      return false
    } finally {
      setLoading(false)
    }
  }
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setUserProfile(null)
    router.push('/')
    toast.success('Logged out successfully')
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateUserProfile(data)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
      throw error
    }
  }
  const refreshUser = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        authAPI.getUserProfile(),
        authAPI.getUserProfileWithRole().catch(() => null)
      ])
      
      setUser(userData)
      setUserProfile(profileData)
    } catch (error) {
      toast.error('Failed to refresh user data')
      throw error
    }
  }
  const value: AuthContextType = {
    user,
    userProfile,
    role,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
