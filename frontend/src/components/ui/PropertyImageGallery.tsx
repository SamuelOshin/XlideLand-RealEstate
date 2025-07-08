import React, { useState } from 'react';
import Image from 'next/image';
import { usePropertyImages } from '@/hooks/usePropertyImages';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from './button';

interface PropertyImageGalleryProps {
  propertyId: string;
  propertyTitle?: string;
  fallbackImages?: string[];
  className?: string;
}

export function PropertyImageGallery({ 
  propertyId, 
  propertyTitle = 'Property',
  fallbackImages = [],
  className = ''
}: PropertyImageGalleryProps) {
  const { images: uploadedImages, loading } = usePropertyImages(propertyId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Combine uploaded images with fallback images
  const allImages = React.useMemo(() => {
    const images = [];
    
    // Add uploaded images from Vercel Blob
    if (uploadedImages && uploadedImages.length > 0) {
      images.push(...uploadedImages.map(img => ({
        url: img.blob_url || '',
        alt: `${propertyTitle} - ${img.file_name || 'Image'}`,
        isMain: img.is_main || false
      })));
    }
    
    // Add fallback images
    if (fallbackImages && fallbackImages.length > 0) {
      images.push(...fallbackImages.map((url, index) => ({
        url: url.startsWith('http') ? url : `/images/property-placeholder.jpg`,
        alt: `${propertyTitle} - Image ${index + 1}`,
        isMain: false
      })));
    }
    
    // If no images, add placeholder
    if (images.length === 0) {
      images.push({
        url: '/images/property-placeholder.jpg',
        alt: `${propertyTitle} - Placeholder`,
        isMain: false
      });
    }
    
    return images;
  }, [uploadedImages, fallbackImages, propertyTitle]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative rounded-lg overflow-hidden bg-gray-100 ${className}`}>
        {/* Main Image */}
        <div 
          className="relative w-full h-full cursor-pointer group"
          onClick={() => setIsFullscreenOpen(true)}
        >
          <Image
            src={allImages[currentIndex]?.url}
            alt={allImages[currentIndex]?.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Overlay with navigation */}
          {allImages.length > 1 && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              {/* Previous Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-gray-900"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Next Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-gray-900"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {currentIndex + 1} / {allImages.length}
              </div>
            </div>
          )}
        </div>
        
        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {allImages.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-white' : 'border-white/50'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={48}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
            {allImages.length > 5 && (
              <div className="w-12 h-8 bg-black/60 rounded flex items-center justify-center text-white text-xs">
                +{allImages.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-900"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
              <Image
                src={allImages[currentIndex]?.url}
                alt={allImages[currentIndex]?.alt}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded">
                  {currentIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
