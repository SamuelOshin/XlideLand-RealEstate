import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-24 h-24 text-3xl'
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12'
};

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  fallback, 
  className = '', 
  onClick 
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const showImage = src && !imageError;
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];

  const avatarContent = (
    <div className={`relative ${sizeClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}>
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={`${sizeClass} rounded-full object-cover border-2 border-white shadow-sm ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-300`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {imageLoading && (
            <div className={`absolute inset-0 ${sizeClass} rounded-full bg-gray-200 animate-pulse border-2 border-white`} />
          )}
        </>
      ) : (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm`}>
          {fallback || <User className={iconSize} />}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full">
        {avatarContent}
      </button>
    );
  }

  return avatarContent;
}
