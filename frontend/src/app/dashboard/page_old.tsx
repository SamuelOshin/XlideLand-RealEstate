'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MessageSquare,
  Heart,
  Bell,
  MapPin,
  Bed,
  Bath,
  Square,
  Clock,
  ArrowRight,
  Star,
  DollarSign,
  Eye,
  Phone,
  Mail,
  Filter,
  MoreHorizontal
} from 'lucide-react';

// Mock data - in real app, this would come from API
const mockDashboardData = {
  user: {
    name: 'Sarah Johnson',
    role: 'buyer',
    memberSince: '2024-01-15',
    profileCompletion: 85
  },
  recentActivity: [
    {
      id: 1,
      type: 'property_saved',
      title: 'Saved "Modern Downtown Condo"',
      description: 'Added to your favorites',
      time: '2 hours ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 2,
      type: 'tour_scheduled',
      title: 'Tour scheduled',
      description: 'Luxury Penthouse - Tomorrow at 2:00 PM',
      time: '5 hours ago',
      icon: Calendar,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'message_received',
      title: 'New message from John Smith',
      description: 'Regarding the Oceanview property',
      time: '1 day ago',
      icon: MessageSquare,
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'alert_triggered',
      title: 'Price alert triggered',
      description: 'Property in Boston dropped by $25,000',
      time: '2 days ago',
      icon: Bell,
      color: 'text-yellow-500'
    }
  ],
  savedProperties: [
    {
      id: 1,
      title: 'Luxury Penthouse in Downtown',
      price: 2500000,
      location: 'Boston, MA',
      bedrooms: 4,
      bathrooms: 3.5,
      area: 3200,
      image: '/img/property-1.jpg',
      priceChange: -25000,
      saved: '2 days ago',
      status: 'available'
    },
    {
      id: 2,
      title: 'Modern Family Home',
      price: 850000,
      location: 'Cambridge, MA',
      bedrooms: 5,
      bathrooms: 3,
      area: 2800,
      image: '/img/property-2.jpg',
      priceChange: 0,
      saved: '1 week ago',
      status: 'available'
    },
    {
      id: 3,
      title: 'Waterfront Condo',
      price: 1200000,
      location: 'Quincy, MA',
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      image: '/img/property-3.jpg',
      priceChange: 15000,
      saved: '3 days ago',
      status: 'pending'
    }
  ],
  upcomingTours: [
    {
      id: 1,
      property: 'Luxury Penthouse in Downtown',
      date: '2025-06-22',
      time: '2:00 PM',
      agent: 'John Smith',
      agentPhone: '(555) 123-4567',
      address: '123 Main St, Boston, MA'
    },
    {
      id: 2,
      property: 'Modern Family Home',
      date: '2025-06-24',
      time: '10:00 AM',
      agent: 'Maria Garcia',
      agentPhone: '(555) 987-6543',
      address: '456 Oak Ave, Cambridge, MA'
    }
  ],
  marketInsights: {
    averagePrice: 1250000,
    priceChange: 5.2,
    daysOnMarket: 28,
    marketTrend: 'up',
    inventory: 1456,
    newListings: 89
  },
  recommendations: [
    {
      id: 1,
      title: 'Victorian House in Back Bay',
      price: 1850000,
      location: 'Boston, MA',
      bedrooms: 4,
      bathrooms: 3,
      area: 2900,
      image: '/img/property-4.jpg',
      matchScore: 95,
      reasons: ['Price range', 'Location preference', 'Property type']
    },
    {
      id: 2,
      title: 'Contemporary Loft',
      price: 750000,
      location: 'Somerville, MA',
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      image: '/img/property-5.jpg',
      matchScore: 87,
      reasons: ['Style preference', 'Budget match', 'Modern amenities']
    }
  ]
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatPriceChange = (change: number) => {
  if (change === 0) return null;
  const formatted = formatPrice(Math.abs(change));
  return change > 0 ? `+${formatted}` : `-${formatted}`;
};

const DashboardOverview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const data = mockDashboardData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  Welcome back, {data.user.name.split(' ')[0]}! 🏡
                </h1>
                <p className="text-emerald-100 text-lg mb-6">
                  Your real estate journey continues. Here's what's happening with your properties and tours.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
                    size="lg"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    View Saved Properties
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    size="lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Tour
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4">Profile Completion</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-100">Progress</span>
                      <span className="font-bold">{data.user.profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.user.profileCompletion}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-white rounded-full h-full"
                      />
                    </div>
                    <p className="text-sm text-emerald-100">
                      Complete your profile to get better recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Properties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
                  <p className="text-gray-600">Your favorited listings</p>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-4">
                {data.savedProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow group"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">
                          {property.title}
                        </h3>
                        <Badge 
                          variant={property.status === 'available' ? 'default' : 'secondary'}
                          className={property.status === 'available' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {property.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            {property.bedrooms}
                          </span>
                          <span className="flex items-center">
                            <Bath className="h-3 w-3 mr-1" />
                            {property.bathrooms}
                          </span>
                          <span className="flex items-center">
                            <Square className="h-3 w-3 mr-1" />
                            {property.area.toLocaleString()} sq ft
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(property.price)}
                          </span>
                          {property.priceChange !== 0 && (
                            <span className={`text-sm font-medium flex items-center ${
                              property.priceChange > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {property.priceChange > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {formatPriceChange(property.priceChange)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          Saved {property.saved}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Tours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Tours</h2>
                  <p className="text-gray-600">Your scheduled property visits</p>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New
                </Button>
              </div>

              <div className="space-y-4">
                {data.upcomingTours.map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{tour.property}</h3>
                      <Badge className="bg-blue-100 text-blue-700">
                        {new Date(tour.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {tour.time}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {tour.address}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Star className="h-4 w-4 mr-2" />
                          Agent: {tour.agent}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                        <p className="text-gray-600 text-xs truncate">{activity.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Market Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Price</span>
                  <span className="font-semibold">{formatPrice(data.marketInsights.averagePrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Change</span>
                  <span className={`font-semibold flex items-center ${
                    data.marketInsights.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.marketInsights.priceChange > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {data.marketInsights.priceChange}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Days on Market</span>
                  <span className="font-semibold">{data.marketInsights.daysOnMarket} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">New Listings</span>
                  <span className="font-semibold">{data.marketInsights.newListings}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Report
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                {data.recommendations.slice(0, 2).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(property.price)}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {property.matchScore}% match
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 truncate">{property.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                      <span>{property.area.toLocaleString()} sq ft</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Recommendations
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
