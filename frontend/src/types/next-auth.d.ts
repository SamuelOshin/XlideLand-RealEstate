import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    googleId?: string
    googleProfile?: {
      id: string
      email: string
      name: string
      picture: string
      email_verified: boolean
    }
    djangoAccessToken?: string
    djangoRefreshToken?: string
    djangoUser?: any
  }

  interface User extends DefaultUser {
    googleId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    googleId?: string
    googleProfile?: {
      id: string
      email: string
      name: string
      picture: string
      email_verified: boolean
    }
    djangoAccessToken?: string
    djangoRefreshToken?: string
    djangoUser?: any
  }
}