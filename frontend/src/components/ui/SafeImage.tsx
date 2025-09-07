'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  unoptimized?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fill = false,
  className = '',
  onLoad,
  onError,
  fallbackSrc = '/img/mock-property/1.jpg',
  unoptimized = false,
  width,
  height,
  sizes,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return false;
    }

    // Filter out common invalid values
    const invalidValues = ['null', 'undefined', 'None', '', ' '];
    if (invalidValues.includes(url.trim())) {
      return false;
    }

    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url);
        return true;
      }
      // Relative paths are considered valid
      if (url.startsWith('/') || (!url.includes('://') && !url.includes('data:'))) {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  };

  useEffect(() => {
    if (!isValidUrl(src)) {
      console.warn('SafeImage: Invalid URL provided, using fallback:', src);
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else {
      setImageSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      console.warn('SafeImage: Failed to load image, using fallback:', imageSrc);
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    onError?.();
  };

  const handleLoad = () => {
    onLoad?.();
  };

  // If we don't have a valid URL at this point, render a placeholder
  if (!imageSrc || !isValidUrl(imageSrc)) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-green-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  const imageProps: any = {
    src: imageSrc,
    alt,
    className,
    onLoad: handleLoad,
    onError: handleError,
    unoptimized: unoptimized || imageSrc.includes('vercel-storage.com'),
  };

  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    if (width) imageProps.width = width;
    if (height) imageProps.height = height;
  }

  return <Image {...imageProps} />;
};

export default SafeImage;
