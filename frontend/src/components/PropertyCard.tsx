'use client';

import React, { useState, useEffect } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Tooltip from '@/components/ui/tooltip';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Eye,
  Phone,
  Mail,
  Car,
  Wifi,
  Shield,
  Star
} from 'lucide-react';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  variant?: 'default' | 'featured' | 'compact';
  showActions?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  variant = 'default',
  showActions = true 
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Extract images from property data (no need for additional API calls)
  const propertyImages = property.images || []; // Use the images array that's already populated

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return new Intl.NumberFormat('en-US').format(area);
  };

  const isValidUrl = (string: string): boolean => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const getImageUrl = () => {
    // Use property images that are already included in the listings API response
    if (propertyImages && propertyImages.length > 0) {
      const mainPhoto = propertyImages[0]; // First image is the main photo
      if (mainPhoto && isValidUrl(mainPhoto)) {
        return mainPhoto;
      }
    }

    // Fallback for backward compatibility
    if (property.images && property.images.length > 0) {
      const photo = property.images[0];
      
      // If it's already a full URL, validate and return it
      if (isValidUrl(photo)) {
        return photo;
      }
      
      // If it's a relative path, construct the full URL
      if (!photo.startsWith('http')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';
        const fullUrl = `${apiUrl}${photo.startsWith('/') ? '' : '/'}${photo}`;
        if (isValidUrl(fullUrl)) {
          return fullUrl;
        }
      }
    }

    // Ultimate fallback to placeholder
    return '/img/mock-property/1.jpg';
  };

  const cardVariants = {
    default: 'w-full',
    featured: 'w-full lg:col-span-2',
    compact: 'w-full max-w-sm'
  };
  const imageVariants = {
    default: 'h-48 sm:h-56',
    featured: 'h-48 lg:h-56', // Reduced from h-64 lg:h-80
    compact: 'h-40'
  };  return (
    <Card className={`group overflow-hidden bg-white border border-gray-200 hover:border-green-300 transition-all duration-300 ease-out hover:shadow-xl will-change-transform h-full flex flex-col ${cardVariants[variant]}`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-100 ${imageVariants[variant]}`}>          
        <SafeImage
          src={getImageUrl()}
          alt={property.title}
          fill
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            setImageLoaded(true);
          }}
          fallbackSrc="/img/mock-property/1.jpg"
        />
          {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 bg-green-200 rounded-lg"></div>
          </div>
        )}        
        {/* Overlay Actions */}
        {showActions && (
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              variant="secondary"
              className="p-2 h-auto bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorited(!isFavorited);
              }}
            >
              <Heart className={`h-4 w-4 transition-colors duration-300 ${isFavorited ? 'fill-green-500 text-green-500' : 'text-gray-600 hover:text-green-500'}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="p-2 h-auto bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                // Handle share functionality
              }}
            >
              <Share2 className="h-4 w-4 text-gray-600 hover:text-green-500 transition-colors duration-300" />
            </Button>
          </div>
        )}        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg">
            {property.isActive ? 'For Sale' : 'Draft'}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">          
          <div className="text-lg lg:text-xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>          
          {property.listing_type === 'rent' && (
            <div className="text-xs text-gray-500">/month</div>
          )}
        </div>        
        {/* Quick View */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <Button 
            variant="secondary" 
            className="bg-white/95 hover:bg-white text-gray-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-0"
          >
            <Eye className="h-4 w-4 mr-2" />
            Quick View
          </Button>
        </div>
      </div>      
      {/* Content */}
      <CardContent className="p-3 lg:p-4 flex-1 flex flex-col"> 
        {/* Added flex properties */}{/* Title & Location */}
        <div className="space-y-1 mb-3"> {/* Reduced spacing */}
          <InstantLoadingLink href={`/properties/${property.id}`}>
            <h3 className="font-semibold text-lg lg:text-xl text-gray-900 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
              {property.title}
            </h3>
          </InstantLoadingLink>          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="h-4 w-4 mr-1 text-green-500" />
            <span className="line-clamp-1">
              {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
            </span>
          </div>
        </div>        
        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-3 text-sm"> {/* Reduced margin */}
          <div className="flex items-center space-x-2">
            <Bed className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">{property.bedrooms} Bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">{property.bathrooms} Bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>          <div className="flex items-center space-x-2">
            <Square className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">{formatArea(property.area)} sqft</span>
          </div>
        </div>        
        {/* Amenities Preview */}
        <div className="flex items-center space-x-3 mb-3 text-gray-500"> 
          {/* Reduced margin */}          {property.features?.some(feature => feature.name === 'Garage') && (
            <div className="flex items-center space-x-1">
              <Car className="h-4 w-4" />
              <span className="text-xs">Garage</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Wifi className="h-4 w-4" />
            <span className="text-xs">WiFi</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Secure</span>
          </div>
        </div>        
        {/* Description Preview */}
        <div className="mb-3 flex-1"> {/* Added flex-1 to push footer down */}
          <Tooltip 
            content={property.description} 
            position="top" 
            delay={300}
            className="w-full"
          >
            <p className="text-gray-600 text-sm line-clamp-1 leading-5 h-5 overflow-hidden cursor-help"> {/* Added cursor-help */}
              {property.description}
            </p>
          </Tooltip>
        </div>
        {/* Agent Info & Actions */}
        <div className="mt-auto"> 
          {/* Push to bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100"> {/* Reduced padding */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {property.realtor?.name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {property.realtor?.name || 'Agent'}
              </p>
              <p className="text-xs text-gray-500">
                {property.realtor?.email || 'Real Estate Agent'}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="p-2 h-auto hover:border-green-300 hover:text-green-600">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="p-2 h-auto hover:border-green-300 hover:text-green-600">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>                  {/* Additional Info */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500"> {/* Reduced margin */}
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <span>ID: #{property.id}</span>
            </div>
          </div>
        </div> {/* Close mt-auto div */}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
