'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
import { Textarea } from '@/components/ui';
import { Badge } from '@/components/ui/badge';

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
  const [imagePreview, setImagePreview] = useState<string[]>([]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Generate preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Submitting property:', formData);
      
      // Redirect to properties list
      router.push('/dashboard/properties/listed');
    } catch (error) {
      console.error('Error submitting property:', error);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
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
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
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
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600">Upload property images</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4"
                />
              </div>
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
