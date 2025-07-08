'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import SearchForm from '@/components/SearchForm';
import Pagination from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { useListings, convertListingToProperty } from '@/hooks/useListings';
import { Property } from '@/types';
import { 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Home,
  Search,
  ChevronRight,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

const PropertiesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  
  // 🔧 FIX: Memoize filters to prevent object recreation on every render
  const filters = useMemo(() => ({}), []);
  
  // 🔧 FIX: Memoize pagination options to prevent infinite re-renders
  const paginationOptions = useMemo(() => ({
    page: 1,
    limit: 12,
    enabled: true
  }), []);
  
  // Fetch real data from backend with pagination
  const { 
    listings, 
    loading, 
    error, 
    pagination,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    totalCount 
  } = useListings(filters, paginationOptions);
  
  // Convert listings to properties and apply sorting
  const properties: Property[] = useMemo(() => {
    if (!listings || listings.length === 0) return [];
    
    const convertedProperties = listings.map(convertListingToProperty);
    
    // Apply sorting
    const sorted = [...convertedProperties].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'bedrooms':
          return b.bedrooms - a.bedrooms;
        case 'area':
          return b.area - a.area;
        case 'featured':
          return Number(b.isFeatured) - Number(a.isFeatured);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return sorted;
  }, [listings, sortBy]); // 🔧 FIX: Added explicit dependencies

  // Calculate average price for stats
  const averagePrice = useMemo(() => {
    if (!properties || properties.length === 0) return 0;
    const total = properties.reduce((sum, property) => sum + property.price, 0);
    return Math.round(total / properties.length);
  }, [properties]); // 🔧 FIX: More stable dependency

  // 🔧 FIX: Memoize page change handlers to prevent unnecessary re-renders
  const handlePageChange = useCallback((page: number) => {
    goToPage(page);
  }, [goToPage]);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
  }, [setLimit]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Failed to load properties</div>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-emerald-600 hover:bg-emerald-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Curved Hero Banner */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
          {/* Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-emerald-100 mb-8"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">Properties</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover Your
                <span className="block text-emerald-200">Dream Property</span>
              </h1>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Explore our exclusive collection of premium properties. From luxury penthouses 
                to charming family homes, find your perfect match in Boston's finest neighborhoods.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{properties.length}+</div>
                  <div className="text-emerald-200 text-sm">Active Listings</div>
                </div>                <div className="text-center">
                  <div className="text-3xl font-bold text-white">$2.5M</div>
                  <div className="text-emerald-200 text-sm">Avg. Price</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">23</div>
                  <div className="text-emerald-200 text-sm">Days on Market</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Start Searching
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-700 font-semibold px-8"
                >
                  View Map
                </Button>
              </div>
            </motion.div>

            {/* Hero Image/Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Floating Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-emerald-400/20 rounded-lg p-2 mr-3">
                      <TrendingUp className="h-6 w-6 text-emerald-200" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">+12%</div>
                      <div className="text-emerald-200 text-sm">Price Growth</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-emerald-400/20 rounded-lg p-2 mr-3">
                      <Eye className="h-6 w-6 text-emerald-200" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">2.8K</div>
                      <div className="text-emerald-200 text-sm">Views Today</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 col-span-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-white mb-1">Most Popular</div>
                      <div className="text-emerald-200 text-sm">Luxury Penthouses</div>
                    </div>
                    <div className="bg-emerald-400/20 rounded-lg p-2">
                      <Home className="h-6 w-6 text-emerald-200" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 mb-12 border border-emerald-100"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Refine Your Search
              </h2>
              <p className="text-gray-600">
                Use our advanced filters to find exactly what you're looking for
              </p>
            </div>
            <SearchForm variant="inline" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Controls Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              {/* Results Info */}
              <div className="flex items-center space-x-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {properties.length} Properties
                  </h2>
                  <div className="flex items-center space-x-2 text-gray-600 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>Greater Boston Area</span>
                  </div>
                </div>
                  {/* Quick Stats */}
                <div className="hidden sm:flex items-center space-x-6 pl-6 border-l border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      ${averagePrice > 0 ? `${Math.round(averagePrice / 1000)}K` : '0'}
                    </div>
                    <div className="text-xs text-gray-500">Avg. Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">23</div>
                    <div className="text-xs text-gray-500">Days on Market</div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>

                {/* Filters Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 transition-all ${
                    showFilters 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>

                {/* Enhanced Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="bedrooms">Most Bedrooms</option>
                  <option value="area">Largest Area</option>
                  <option value="featured">Featured First</option>
                </select>

                {/* Per Page Selector */}
                <select 
                  value={pagination?.limit || 12}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                >
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                  <option value={48}>48 per page</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Advanced Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <SearchForm variant="sidebar" />
            </motion.div>
          )}

          {/* Enhanced Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <PropertyCard 
                    property={property} 
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                  
                  {/* Enhanced Quick Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-2">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm">
                        <Share2 className="h-4 w-4 text-gray-600 hover:text-emerald-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16"
            >
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onNext={nextPage}
                onPrevious={previousPage}
                loading={loading}
                className="justify-center"
                showInfo={true}
                showPageNumbers={true}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Premium Market Insights */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Market Insights & Trends
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay ahead with real-time market data, trends, and insights from Boston's 
              most dynamic real estate landscape.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: TrendingUp,
                title: "Market Growth",
                value: "+12.5%",
                subtitle: "Year over year increase",
                color: "emerald",
                trend: "+2.3% this month"
              },
              {
                icon: MapPin,
                title: "Avg. Days on Market",
                value: "18",
                subtitle: "Faster than last year",
                color: "blue",
                trend: "-5 days vs 2023"
              },
              {
                icon: Home,
                title: "Inventory Level",
                value: "2,847",
                subtitle: "Active listings",
                color: "purple",
                trend: "+156 new this week"
              },
              {
                icon: Eye,
                title: "Market Activity",
                value: "94%",
                subtitle: "Properties with offers",
                color: "orange",
                trend: "High demand area"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`bg-${stat.color}-500/20 rounded-xl p-3 mr-4`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-300`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{stat.title}</h3>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.subtitle}</div>
                </div>
                <div className="text-xs text-emerald-300 bg-emerald-500/10 rounded-lg px-2 py-1 inline-block">
                  {stat.trend}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Market Trends Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Price Trends by Neighborhood
                </h3>
                <p className="text-gray-300 mb-6">
                  Discover the hottest neighborhoods and emerging markets in the Boston area.
                </p>
                
                <div className="space-y-4">
                  {[
                    { area: "Back Bay", change: "+15.2%", price: "$1.2M", trend: "up" },
                    { area: "Cambridge", change: "+12.8%", price: "$950K", trend: "up" },
                    { area: "Beacon Hill", change: "+8.4%", price: "$1.8M", trend: "up" },
                    { area: "South End", change: "+6.1%", price: "$875K", trend: "up" }
                  ].map((neighborhood) => (
                    <div key={neighborhood.area} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                        <span className="text-white font-medium">{neighborhood.area}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-300 font-semibold">{neighborhood.change}</div>
                        <div className="text-gray-400 text-sm">{neighborhood.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300 mb-2">
                    $1.1M
                  </div>
                  <div className="text-white text-lg mb-1">Average Home Price</div>
                  <div className="text-gray-400 text-sm mb-6">Greater Boston Area</div>
                  
                  {/* Simple visual representation */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price Range</span>
                      <span className="text-white">$450K - $2.5M</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Entry Level</span>
                      <span>Luxury</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Let our expert team help you navigate Boston's competitive real estate market. 
              Get personalized recommendations and exclusive access to new listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-sm"
              >
                Schedule Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-xl"
              >
                Browse All Listings
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PropertiesPage;
