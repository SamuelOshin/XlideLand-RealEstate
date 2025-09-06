/**
 * NextAuth.js v5 configuration for Google OAuth2
 */
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist Google OAuth tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.googleId = account.providerAccountId
      }
      
      // Add Google profile information
      if (profile) {
        token.googleProfile = {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          email_verified: profile.email_verified,
        }
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.googleId = token.googleId as string
      session.googleProfile = token.googleProfile as any
      
      return session
    },
    async signIn({ account, profile, user }) {
      // Verify Google profile
      if (account?.provider === "google") {
        if (!profile?.email || !profile?.email_verified) {
          return false
        }
        
        // Additional security checks can be added here
        return true
      }
      
      return true
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)