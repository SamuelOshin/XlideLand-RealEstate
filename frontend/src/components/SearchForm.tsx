'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Home, 
  DollarSign, 
  Filter,
  Bed,
  Bath,
  Square,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
  variant?: 'hero' | 'inline' | 'sidebar';
  className?: string;
}

interface SearchFilters {
  query?: string;
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  variant = 'hero',
  className = '' 
}) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const propertyTypes = [
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'villa', label: 'Villa' },
  ];

  const priceRanges = [
    { value: '0-100000', label: 'Under ₦100K' },
    { value: '100000-250000', label: '₦100K - ₦250K' },
    { value: '250000-500000', label: '₦250K - ₦500K' },
    { value: '500000-1000000', label: '₦500K - ₦1M' },
    { value: '1000000-', label: 'Over ₦1M' },
  ];

  const handleInputChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceRangeChange = (range: string) => {
    if (range === '') {
      setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
      return;
    }

    const [min, max] = range.split('-').map(v => v ? parseInt(v) : undefined);
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  const clearFilters = () => {
    setFilters({});
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };
  // Hero variant - large search form for homepage
  if (variant === 'hero') {
    return (
      <Card className={`w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl ${className}`}>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Search Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Location */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />                  <Input
                    placeholder="City, neighborhood, or address"
                    value={filters.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 h-12 sm:h-14 text-base border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />                  
                  <select
                    value={filters.propertyType || ''}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full pl-10 pr-4 h-12 sm:h-14 text-base border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-900 appearance-none"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />                  <select
                    onChange={(e) => handlePriceRangeChange(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 sm:h-14 text-base border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-900 appearance-none"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"                
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 h-12 px-4"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Advanced Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {getActiveFiltersCount() > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center justify-center space-x-2 h-12 px-6"
                  >
                    <X className="h-5 w-5" />
                    <span>Clear</span>
                  </Button>
                )}                
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 h-12 sm:h-14 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-[200px]"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>            {/* Advanced Filters */}
            {showAdvanced && (
              <div className="pt-6 border-t border-gray-200 space-y-6">
                {/* Keywords */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Keywords</label>                  
                  <Input
                    placeholder="Pool, garage, fireplace, etc."
                    value={filters.query || ''}
                    onChange={(e) => handleInputChange('query', e.target.value)}
                    className="h-12 text-base bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <Button
                          key={num}
                          type="button"
                          variant={filters.bedrooms === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange('bedrooms', filters.bedrooms === num ? 0 : num)}
                          className="flex-1 min-w-[60px] h-10 sm:h-12"
                        >
                          <Bed className="h-4 w-4 mr-1" />
                          {num}+
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Bathrooms</label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <Button
                          key={num}
                          type="button"
                          variant={filters.bathrooms === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleInputChange('bathrooms', filters.bathrooms === num ? 0 : num)}
                          className="flex-1 min-w-[60px] h-10 sm:h-12"
                        >
                          <Bath className="h-4 w-4 mr-1" />
                          {num}+
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Area Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Min Area (sqft)</label>                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minArea || ''}
                        onChange={(e) => handleInputChange('minArea', parseInt(e.target.value) || 0)}
                        className="pl-10 h-12 text-base bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">                    
                    <label className="text-sm font-medium text-gray-700">Max Area (sqft)</label>                    <div className="relative">
                      <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        type="number"
                        placeholder="Any"
                        value={filters.maxArea || ''}
                        onChange={(e) => handleInputChange('maxArea', parseInt(e.target.value) || 0)}
                        className="pl-10 h-12 text-base bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Price Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Min Price ($)</label>                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value) || 0)}
                        className="pl-10 h-12 text-base bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Max Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Any"
                        value={filters.maxPrice || ''}                        onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value) || 0)}
                        className="pl-10 h-12 text-base bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  // Inline variant - compact search for listings page
  if (variant === 'inline') {
    return (
      <Card className={`w-full bg-white border border-gray-200 shadow-sm ${className}`}>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />                  
                  <Input
                    placeholder="Search properties..."
                    value={filters.query || ''}
                    onChange={(e) => handleInputChange('query', e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6">
                Search
              </Button>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-200">                <Input
                  placeholder="Location"
                  value={filters.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                />                <select
                  value={filters.propertyType || ''}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white text-gray-900"
                >
                  <option value="">Property Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>                <Input
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value) || 0)}
                  className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value) || 0)}
                  className="bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  // Sidebar variant - for property pages
  return (
    <div className={`space-y-4 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" />          <Input
            placeholder="Search..."
            value={filters.query || ''}
            onChange={(e) => handleInputChange('query', e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
          />
        </div>
        
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
