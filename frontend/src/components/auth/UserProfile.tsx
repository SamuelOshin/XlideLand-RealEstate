'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { authAPI } from '@/lib/api'
import { toast } from 'sonner'
import { LinkIcon, UnlinkIcon, CheckCircle } from 'lucide-react'

interface UserProfileProps {
  className?: string
}

export function UserProfile({ className = '' }: UserProfileProps) {
  const { data: session } = useSession()
  const { user, userProfile, refreshUser } = useAuth()
  const [isLinking, setIsLinking] = React.useState(false)
  const [isUnlinking, setIsUnlinking] = React.useState(false)

  const handleLinkGoogle = async () => {
    if (!session?.accessToken) {
      toast.error('Please sign in with Google first')
      return
    }

    try {
      setIsLinking(true)
      await authAPI.linkGoogleAccount({
        access_token: session.accessToken as string
      })
      
      await refreshUser()
      toast.success('Google account linked successfully!')
      
    } catch (error: any) {
      console.error('Google account linking error:', error)
      toast.error(error.response?.data?.error || 'Failed to link Google account')
    } finally {
      setIsLinking(false)
    }
  }

  const handleUnlinkGoogle = async () => {
    try {
      setIsUnlinking(true)
      await authAPI.unlinkGoogleAccount()
      
      await refreshUser()
      toast.success('Google account unlinked successfully!')
      
    } catch (error: any) {
      console.error('Google account unlinking error:', error)
      toast.error(error.response?.data?.error || 'Failed to unlink Google account')
    } finally {
      setIsUnlinking(false)
    }
  }

  if (!user) {
    return null
  }

  const isGoogleUser = userProfile?.is_google_user
  const googlePicture = userProfile?.google_picture
  const googleEmail = userProfile?.google_email
  const googleVerified = userProfile?.google_verified

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar 
          className="h-16 w-16"
          src={googlePicture || userProfile?.avatar || ''} 
          alt={user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
          fallback={user.first_name ? user.first_name.charAt(0) : user.username.charAt(0)}
          size="xl"
        />

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-text-primary text-lg font-semibold">
              {user.first_name && user.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user.username
              }
            </h3>
            {isGoogleUser && googleVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Google Verified
              </Badge>
            )}
          </div>
          
          <p className="text-text-muted text-sm mb-2">{user.email}</p>
          
          {isGoogleUser && googleEmail && googleEmail !== user.email && (
            <p className="text-text-subtle text-xs">
              Google: {googleEmail}
            </p>
          )}
          
          <Badge variant="outline" className="text-xs">
            {userProfile?.role ? 
              userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 
              'Buyer'
            }
          </Badge>
        </div>

        {/* Google Account Actions */}
        <div className="flex flex-col gap-2">
          {isGoogleUser ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnlinkGoogle}
              disabled={isUnlinking}
              className="text-xs"
            >
              <UnlinkIcon className="h-3 w-3 mr-1" />
              {isUnlinking ? 'Unlinking...' : 'Unlink Google'}
            </Button>
          ) : session ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkGoogle}
              disabled={isLinking}
              className="text-xs"
            >
              <LinkIcon className="h-3 w-3 mr-1" />
              {isLinking ? 'Linking...' : 'Link Google'}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Google Integration Status */}
      {isGoogleUser && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 text-sm font-medium">
              Google Account Connected
            </span>
          </div>
          <p className="text-blue-700 text-xs mt-1">
            You can sign in using either your XlideLand credentials or Google account.
          </p>
        </div>
      )}
    </div>
  )
}

export default UserProfile