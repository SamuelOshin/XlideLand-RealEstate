/**
 * NextAuth.js v5 configuration for Google OAuth2
 */
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    djangoAccessToken?: string
    djangoRefreshToken?: string
    djangoUser?: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    djangoAccessToken?: string
    djangoRefreshToken?: string
    djangoUser?: any
  }
}

export const authConfig: NextAuthConfig = {
  // trustHost: true, Trust localhost in development
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      // Persist Google OAuth tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.googleId = account.providerAccountId
      }

      // Add Google profile information
      if (profile && profile.sub && profile.email && profile.name) {
        token.googleProfile = {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture || undefined,
          email_verified: profile.email_verified || false,
        }

        // Call Django backend to authenticate and get JWT tokens
        try {
          const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '')
          
          const djangoResponse = await fetch(`${API_BASE_URL}/api/accounts/google/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id_token: account?.id_token,
              access_token: account?.access_token,
            }),
          })

          if (djangoResponse.ok) {
            const djangoData = await djangoResponse.json()
            
            // Store Django JWT tokens
            token.djangoAccessToken = djangoData.access
            token.djangoRefreshToken = djangoData.refresh
            token.djangoUser = djangoData.user

            // Store in localStorage for immediate API use
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', djangoData.access)
              localStorage.setItem('refresh_token', djangoData.refresh || '')
              localStorage.setItem('user_data', JSON.stringify(djangoData.user))
            }

            console.log('✅ Django authentication successful')
          } else {
            const errorData = await djangoResponse.text()
            console.error('❌ Django authentication failed:', errorData)
          }
        } catch (error) {
          console.error('❌ Error calling Django backend:', error)
        }
      }

      // If we already have Django tokens, make sure they're in localStorage
      if (token.djangoAccessToken && typeof window !== 'undefined') {
        localStorage.setItem('access_token', token.djangoAccessToken)
        localStorage.setItem('refresh_token', token.djangoRefreshToken || '')
        if (token.djangoUser) {
          localStorage.setItem('user_data', JSON.stringify(token.djangoUser))
        }
      } else {
        // Check if tokens exist in localStorage but not in token (session restoration)
        if (typeof window !== 'undefined') {
          const existingToken = localStorage.getItem('access_token')
          const existingRefreshToken = localStorage.getItem('refresh_token')
          const existingUserData = localStorage.getItem('user_data')
          
          if (existingToken && existingUserData) {
            token.djangoAccessToken = existingToken
            token.djangoRefreshToken = existingRefreshToken || ''
            try {
              token.djangoUser = JSON.parse(existingUserData)
            } catch (e) {
              console.error('Failed to parse user data from localStorage:', e)
              // Clear corrupted data
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              localStorage.removeItem('user_data')
            }
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.googleId = token.googleId as string
      session.googleProfile = token.googleProfile as any

      // Include Django tokens and user data
      session.djangoAccessToken = token.djangoAccessToken as string
      session.djangoRefreshToken = token.djangoRefreshToken as string
      session.djangoUser = token.djangoUser as any

      // Ensure tokens are in localStorage for API compatibility
      if (token.djangoAccessToken && typeof window !== 'undefined') {
        localStorage.setItem('access_token', token.djangoAccessToken)
        localStorage.setItem('refresh_token', token.djangoRefreshToken || '')
        if (token.djangoUser) {
          localStorage.setItem('user_data', JSON.stringify(token.djangoUser))
        }
      }

      return session
    },

    async signIn({ account, profile, user }) {
      // Allow sign in for Google provider
      if (account?.provider === 'google' && profile?.email) {
        return true
      }
      return false
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  
  events: {
    async signOut() {
      // Clear Django tokens on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
      }
    },
  },
  
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)