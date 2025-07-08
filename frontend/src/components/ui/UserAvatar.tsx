import React from 'react';
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './Avatar';

interface UserAvatarProps {
  userId?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnlineStatus?: boolean;
  onClick?: () => void;
  showLoadingState?: boolean;
}

export function UserAvatar({ 
  size = 'md', 
  className = '', 
  showOnlineStatus = false,
  onClick,
  showLoadingState = true
}: UserAvatarProps) {
  const { user } = useAuth();
  const { avatar, loading, error } = useUserAvatar();

  // Show loading state
  if (loading && showLoadingState) {
    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20',
      '2xl': 'w-24 h-24'
    };

    return (
      <div className={`${className} animate-pulse`}>
        <div className={`rounded-full bg-gray-200 border-2 border-white ${sizeClasses[size]}`} />
      </div>
    );
  }

  // Generate fallback initials
  const generateFallback = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  const fallbackInitials = generateFallback();

  return (
    <div className={`relative ${className}`}>
      <Avatar
        src={avatar?.avatar_url}
        alt={`${user?.first_name || user?.username || 'User'}'s avatar`}
        size={size}
        fallback={fallbackInitials}
        onClick={onClick}
      />
      
      {/* Online status indicator */}
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
      
      {/* Error indicator (optional) */}
      {error && !avatar?.has_avatar && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      )}
    </div>
  );
}
