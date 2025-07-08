'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { redirectToAuth } from '@/lib/auth-utils';
import { authenticatedFetch } from '@/lib/auth-helpers';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';
import {
  Building2,
  Upload,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar,
  Image as ImageIcon,
  X,
  Save,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import FileUploadDeferred from '@/components/ui/FileUploadDeferred';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  features: string[];
  images: File[];
}

export default function NewPropertyPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    lotSize: '',
    yearBuilt: '',
    features: [],
    images: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const propertyTypes = [
    'house',
    'apartment',
    'condo',
    'townhouse',
    'villa',
    'duplex',
    'studio',
    'loft'
  ];

  const commonFeatures = [
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Balcony',
    'Fireplace',
    'Air Conditioning',
    'Heating',
    'Security System',
    'Elevator',
    'Furnished',
    'Pet Friendly'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleImageRemoved = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
    setNewFeature('');
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user token for authentication - try multiple sources
      let token = localStorage.getItem('access_token');
      
      // Debug: Check all possible token locations
      console.log('Debug - Token sources:', {
        access_token: !!localStorage.getItem('access_token'),
        token: !!localStorage.getItem('token'),
        userContext: !!user,
        isAuthenticated: isAuthenticated
      });
      
      // If no token in localStorage, check if user is available
      if (!token && !isAuthenticated) {
        throw new Error('You are not logged in. Please log in and try again.');
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please log out and log in again.');
      }

      // Step 1: Upload images if any are selected
      let uploadedImages: any[] = [];
      if (selectedImages.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        
        const uploadFormData = new FormData();
        selectedImages.forEach((file, index) => {
          uploadFormData.append('file', file);
        });

        console.log('Uploading images...');

        const uploadResponse = await authenticatedFetch('/api/upload/property-images', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          
          // Handle authentication errors specifically
          if (uploadResponse.status === 401) {
            toast.dismiss('upload');
            throw new Error('Authentication failed. Please log in again.');
          }
          
          toast.dismiss('upload');
          throw new Error(`Failed to upload images: ${errorData.error || 'Unknown error'}`);
        }

        const uploadResult = await uploadResponse.json();
        uploadedImages = uploadResult.files || [];
        console.log('Images uploaded successfully:', uploadedImages.length);
        
        toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`, { id: 'upload' });
      }

      // Step 2: Create property with form data and uploaded images
      const propertyData = {
        ...formData,
        images: uploadedImages,
      };

      console.log('Creating property listing:', propertyData);
      toast.loading('Creating property listing...', { id: 'create' });

      // Submit property data to backend using authenticated fetch
      const createResponse = await authenticatedFetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        toast.dismiss('create');
        
        // Handle specific error cases
        if (createResponse.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (createResponse.status === 400) {
          throw new Error(errorData.error || 'Invalid property data. Please check your inputs.');
        } else {
          throw new Error(errorData.error || 'Failed to create property listing');
        }
      }

      const result = await createResponse.json();
      console.log('Property created successfully:', result);
      
      // Success message
      toast.success('Property created successfully!', {
        description: 'Your property listing has been created and will be reviewed shortly.',
        duration: 4000,
        id: 'create'
      });
      
      // Redirect to properties list
      router.push('/dashboard/properties/listed');
    } catch (error) {
      console.error('Error submitting property:', error);
      
      // Handle authentication errors by redirecting to login
      if (error instanceof Error && error.message.includes('Authentication')) {
        toast.error('Session expired', {
          description: 'Your session has expired. Please log in again.',
          duration: 5000,
        });
        router.push('/auth/login');
        return;
      }
      
      // Show error message to user
      toast.error('Failed to create property', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // Implement draft saving logic
  };

  const handlePreview = () => {
    console.log('Preview property:', formData);
    // Implement preview logic
  };

  // Debug function to check authentication state
  const checkAuthState = () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('Auth Debug:', {
      hasToken: !!token,
      tokenLength: token?.length,
      hasRefreshToken: !!refreshToken,
      user: user?.username,
      role: role,
      isAuthenticated
    });
  };

  // Call debug function when component mounts
  useEffect(() => {
    checkAuthState();
  }, [user, role, isAuthenticated]);

  // Add debug info in development
  const showDebugInfo = process.env.NODE_ENV === 'development';

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Authentication Required</h2>
            <p className="text-gray-600 mt-2">Please log in to create a property listing.</p>
          </div>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Debug Info (Development Only) */}
        {showDebugInfo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h3>
            <pre className="text-xs text-yellow-700">
              {JSON.stringify({
                isAuthenticated,
                hasUser: !!user,
                username: user?.username,
                role,
                hasAccessToken: !!localStorage.getItem('access_token'),
                hasRefreshToken: !!localStorage.getItem('refresh_token'),
                tokenPreview: localStorage.getItem('access_token')?.substring(0, 20) + '...'
              }, null, 2)}
            </pre>
            <div className="mt-2 space-x-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log('Current localStorage:', Object.keys(localStorage));
                  console.log('Auth context:', { user, isAuthenticated, role });
                }}
              >
                Log Auth State
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  router.push('/auth/login');
                }}
              >
                Clear & Re-login
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
              <p className="text-gray-600">Create a new property listing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter property title"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter property description"
                  rows={4}
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <Input
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <Input
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <Input
                  name="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <Input
                  name="sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size (sq ft)
                </label>
                <Input
                  name="lotSize"
                  type="number"
                  value={formData.lotSize}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <Input
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="bg-white/90 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonFeatures.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => addFeature(feature)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      formData.features.includes(feature)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="bg-white/90 border-gray-200"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add custom feature"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature(newFeature);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addFeature(newFeature)}
                >
                  Add
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(feature => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
            
            {/* Property Images Deferred Upload Component */}
            <FileUploadDeferred
              uploadType="property-images"
              selectedFiles={selectedImages}
              onFilesSelected={handleImagesSelected}
              onFileRemoved={handleImageRemoved}
              onError={(error) => {
                console.error('Property images selection error:', error);
              }}
            />
          </div>

          {/* Submit */}          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 text-text-primary border border-gray-300 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
