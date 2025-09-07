'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronRight as BreadcrumbChevron,
  Star,
  Check,
  Car,
  Wifi,
  Shield,
  Zap,
  Trees,
  Dumbbell,
  Camera,
  Play,
  Send,
  User,
  Clock,
  Eye,
  Download,
  Calculator,
  TrendingUp,
  Building2,
  Navigation,
  X,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

// Mock property data - in real app, this would come from API based on ID
const propertyData = {
  id: 1,
  title: 'Luxury Penthouse in Downtown',
  category: 'Luxury',
  type: 'Sale',
  description: 'Stunning penthouse with panoramic city views, premium finishes, and world-class amenities. This exceptional property offers the pinnacle of urban luxury living with uncompromising quality and attention to detail.',
  price: 2500000,
  bedrooms: 4,
  bathrooms: 3.5,
  area: 3200,
  yearBuilt: 2019,
  parking: 2,
    location: {
    address: '123 Main St',
    city: 'Lagos',
    state: 'Lagos State',
    zipCode: '100001',
    neighborhood: 'Victoria Island',
    coordinates: { lat: 6.4551, lng: 3.3942 }
  },
  images: [
    '/img/property-1.jpg',
    '/img/property-1-2.jpg',
    '/img/showcase.jpg',
    '/img/hero.jpg',
    '/img/hero-1.png',
    '/img/hero-2.png'
  ],
  features: [
    'Panoramic City Views',
    'Rooftop Terrace',
    'Smart Home Technology',
    'Concierge Service',
    'Fitness Center',
    'Swimming Pool',
    'Wine Storage',
    'In-Unit Laundry',
    'Hardwood Floors',
    'Granite Countertops',
    'Stainless Steel Appliances',
    'Walk-in Closets'
  ],
  amenities: [
    { name: 'Parking Garage', icon: Car },
    { name: 'High-Speed Internet', icon: Wifi },
    { name: '24/7 Security', icon: Shield },
    { name: 'Smart Home', icon: Zap },
    { name: 'Rooftop Garden', icon: Trees },
    { name: 'Fitness Center', icon: Dumbbell }
  ],
  realtor: {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Founder & CEO',
    phone: '+234 907 661 4145',
    email: 'Opeyemib117@gmail.com',
    photo: '/img/realtor-1.jpg',
    bio: 'With over 15 years of experience in luxury real estate, Sarah leads XlideLand with passion and expertise.',
    totalSales: '$45M+',
    experience: '15+ Years',
    rating: 4.9,
    reviews: 127
  },
  details: {
    propertyType: 'Condominium',
    style: 'Contemporary',
    floors: 2,
    parking: 2,
    hoa: 850,
    taxes: 18500,
    heating: 'Central',
    cooling: 'Central Air',
    laundry: 'In Unit',
    fireplaces: 1
  },
  priceHistory: [
    { date: '2024-01-15', price: 2500000, event: 'Listed' },
    { date: '2024-01-20', price: 2450000, event: 'Price Reduction' },
    { date: '2024-02-01', price: 2500000, event: 'Price Increase' }
  ],
  similarProperties: [
    { id: 2, title: 'Modern Family Home', price: 850000, image: '/img/property-2.jpg', bedrooms: 5, bathrooms: 3, area: 2800 },
    { id: 3, title: 'Waterfront Condo', price: 1200000, image: '/img/property-3.jpg', bedrooms: 3, bathrooms: 2, area: 2200 },
    { id: 4, title: 'Suburban Villa', price: 750000, image: '/img/property-4.jpg', bedrooms: 4, bathrooms: 3, area: 3000 }
  ],
  createdAt: '2024-01-15',
  updatedAt: '2024-02-01',
  isActive: true,
  isFeatured: true,
  views: 1247,
  saves: 89,
  daysOnMarket: 18
};

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

const PropertyDetailPage = ({ params }: PropertyDetailPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this property. Please contact me with more information.'
  });

  // In real app, fetch property data based on params.id
  const property = propertyData;

  if (!property) {
    notFound();
  }

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Gallery Modal */}
      {isGalleryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-6 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-6 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight className="h-12 w-12" />
            </button>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Property Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/img/world-map-dotted.svg')] bg-center bg-no-repeat bg-cover"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <nav className="flex items-center space-x-2 text-emerald-100 text-sm mb-6">
                <Link href="/" className="hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                </Link>
                <BreadcrumbChevron className="h-4 w-4" />
                <Link href="/properties" className="hover:text-white transition-colors">
                  Properties
                </Link>
                <BreadcrumbChevron className="h-4 w-4" />
                <span className="text-white font-medium truncate">
                  {property.title}
                </span>
              </nav>

              <div className="flex items-center space-x-3 mb-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {property.category}
                </Badge>
                <Badge variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  For {property.type}
                </Badge>
                {property.isFeatured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge className="bg-emerald-500/30 text-white border-emerald-300">
                  {property.daysOnMarket} Days on Market
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {property.title}
              </h1>
              
              <div className="flex items-center text-emerald-100 mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">
                  {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bed className="h-5 w-5 mr-2" />
                    <span className="text-2xl font-bold">{property.bedrooms}</span>
                  </div>
                  <div className="text-emerald-100 text-sm">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bath className="h-5 w-5 mr-2" />
                    <span className="text-2xl font-bold">{property.bathrooms}</span>
                  </div>
                  <div className="text-emerald-100 text-sm">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Square className="h-5 w-5 mr-2" />
                    <span className="text-2xl font-bold">{property.area.toLocaleString()}</span>
                  </div>
                  <div className="text-emerald-100 text-sm">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Car className="h-5 w-5 mr-2" />
                    <span className="text-2xl font-bold">{property.details.parking}</span>
                  </div>
                  <div className="text-emerald-100 text-sm">Parking</div>
                </div>
              </div>
            </div>

            <div className="lg:text-right">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="text-5xl lg:text-6xl font-bold mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-emerald-100 text-lg mb-4">
                  ${Math.round(property.price / property.area)}/sq ft
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center border-t border-white/20 pt-4">
                  <div>
                    <div className="text-xl font-bold">{property.views.toLocaleString()}</div>
                    <div className="text-emerald-100 text-xs">Views</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{property.saves}</div>
                    <div className="text-emerald-100 text-xs">Saves</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{property.realtor.reviews}</div>
                    <div className="text-emerald-100 text-xs">Reviews</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`group relative overflow-hidden transition-all duration-300 ${
                    isFavorited 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl'
                  }`}
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                  <Heart className={`h-5 w-5 mr-3 transition-all duration-300 ${isFavorited ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-semibold">
                    {isFavorited ? '❤️ Property Saved' : '🤍 Save Property'}
                  </span>
                </Button>
                
                <Button 
                  className="group relative overflow-hidden bg-white text-emerald-700 hover:text-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Phone className="h-5 w-5 mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-semibold relative z-10">📞 Contact Agent</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                </Button>
                
                <Button 
                  className="group relative overflow-hidden border-2 border-white/40 text-white hover:border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Share2 className="h-5 w-5 mr-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-semibold relative z-10">🔗 Share Property</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                </Button>

                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                    <div className="text-lg font-bold">🔥</div>
                    <div className="text-xs text-emerald-100">Hot Property</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                    <div className="text-lg font-bold">⚡</div>
                    <div className="text-xs text-emerald-100">Quick Response</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                    <div className="text-lg font-bold">🏆</div>
                    <div className="text-xs text-emerald-100">Premium Listing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 fill-gray-50">
            <path d="M0,120 C150,60 350,0 600,20 C850,40 1050,100 1200,60 L1200,120 Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* Premium Image Gallery */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative -mt-4 mb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            <div className="grid grid-cols-4 gap-3 p-4 h-96 md:h-[500px]">
              <div 
                className="col-span-4 md:col-span-2 relative cursor-pointer group overflow-hidden rounded-2xl"
                onClick={() => setIsGalleryOpen(true)}
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium">
                  <Camera className="h-4 w-4 inline mr-2" />
                  {property.images.length} Premium Photos
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-4 w-4 inline mr-1" />
                  View Gallery
                </div>
              </div>

              <div className="hidden md:block col-span-2">
                <div className="grid grid-cols-2 gap-3 h-full">
                  {property.images.slice(1, 5).map((image: string, index: number) => (
                    <div 
                      key={index}
                      className={`relative cursor-pointer group overflow-hidden rounded-xl ${
                        index === 1 ? 'rounded-tr-2xl' : index === 3 ? 'rounded-br-2xl' : ''
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index + 1);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - ${index + 2}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                      {index === 3 && property.images.length > 5 && (
                        <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white font-semibold">
                          <span className="text-2xl font-bold">+{property.images.length - 5}</span>
                          <span className="text-sm">More Photos</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'details', label: 'Details' },
                    { id: 'features', label: 'Features' },
                    { id: 'location', label: 'Location' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.features.slice(0, 6).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Property Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Type:</span>
                          <span className="font-medium">{property.details.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built:</span>
                          <span className="font-medium">{property.yearBuilt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Style:</span>
                          <span className="font-medium">{property.details.style}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Floors:</span>
                          <span className="font-medium">{property.details.floors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fireplaces:</span>
                          <span className="font-medium">{property.details.fireplaces}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">HOA Fees:</span>
                          <span className="font-medium">${property.details.hoa}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Taxes:</span>
                          <span className="font-medium">${property.details.taxes.toLocaleString()}/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heating:</span>
                          <span className="font-medium">{property.details.heating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cooling:</span>
                          <span className="font-medium">{property.details.cooling}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Property Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Check className="h-5 w-5 text-emerald-600" />
                            <span className="text-gray-700 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Building Amenities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.amenities.map((amenity: { name: string; icon: any }, index: number) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                            <span className="text-gray-700 font-medium">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Location & Neighborhood</h3>
                      <div className="bg-gray-100 rounded-xl p-6 mb-6">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            {property.location.neighborhood}
                          </div>
                          <div className="text-gray-600">
                            {property.location.address}<br />
                            {property.location.city}, {property.location.state} {property.location.zipCode}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-emerald-50 rounded-xl">
                          <div className="text-2xl font-bold text-emerald-600 mb-1">9.2</div>
                          <div className="text-gray-600 text-sm">Walk Score</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600 mb-1">8.7</div>
                          <div className="text-gray-600 text-sm">Transit Score</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <div className="text-2xl font-bold text-green-600 mb-1">7.9</div>
                          <div className="text-gray-600 text-sm">Bike Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {property.similarProperties.map((similar: any) => (
                  <div key={similar.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={similar.image}
                      alt={similar.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{similar.title}</h4>
                      <div className="text-xl font-bold text-emerald-600 mb-2">
                        {formatPrice(similar.price)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{similar.bedrooms} bed</span>
                        <span>{similar.bathrooms} bath</span>
                        <span>{similar.area.toLocaleString()} sq ft</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24"
            >
              <div className="text-center mb-6">
                <img
                  src={property.realtor.photo}
                  alt={property.realtor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900">{property.realtor.name}</h3>
                <p className="text-emerald-600 font-medium">{property.realtor.title}</p>
                
                <div className="flex items-center justify-center mt-2 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(property.realtor.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {property.realtor.rating} ({property.realtor.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{property.realtor.experience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Sales:</span>
                  <span className="font-medium">{property.realtor.totalSales}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-3 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                  <span className="font-semibold">📞 Call {property.realtor.phone}</span>
                </Button>
                <Button 
                  className="w-full group border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-700 hover:text-emerald-700 transition-all duration-300"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                  <span className="font-semibold">✉️ Send Email</span>
                </Button>
              </div>
            </motion.div>

            {/* Enhanced Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 border border-emerald-200 shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4 shadow-lg">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Information</h3>
                  <p className="text-gray-600">Get in touch with our expert team</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-12 h-14 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-14 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-12 h-14 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="relative">
                    <textarea
                      className="w-full pl-4 pr-4 pt-4 pb-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm"
                      rows={4}
                      placeholder="Tell us about your needs..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg font-semibold rounded-xl relative overflow-hidden"
                  >
                    <MessageSquare className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                    💬 Send Message
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-emerald-200/50">
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-emerald-600" />
                      Secure & Private
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-emerald-600" />
                      Quick Response
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-1 text-emerald-600" />
                      No Spam
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>            {/* Quick Actions Popup - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              {/* Trigger Button with Enhanced Animations */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                  className="w-full group relative bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-600 hover:from-emerald-700 hover:via-emerald-800 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 h-16 text-lg font-bold rounded-2xl overflow-hidden border border-emerald-500/20"
                >
                  {/* Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-center w-full">
                    <motion.div
                      animate={{ rotate: isQuickActionsOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Zap className="h-6 w-6 mr-3 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    </motion.div>
                    <span className="flex items-center">
                      ⚡ Quick Actions
                      <motion.span
                        animate={{ x: isQuickActionsOpen ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        ✨
                      </motion.span>
                    </span>
                    <motion.div
                      animate={{ rotate: isQuickActionsOpen ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-auto"
                    >
                      <ChevronRight className="h-5 w-5 transition-transform duration-300" />
                    </motion.div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10"></div>
                </Button>
              </motion.div>

              {/* Enhanced Popup Panel */}
              {isQuickActionsOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsQuickActionsOpen(false)}
                  />
                  
                  {/* Popup Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                  >
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                            <p className="text-sm text-gray-600">Choose your next step</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setIsQuickActionsOpen(false)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Action Buttons Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          {
                            icon: Calendar,
                            emoji: "📅",
                            title: "Schedule Private Tour",
                            desc: "Book a personalized viewing",
                            gradient: "from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100",
                            textColor: "text-emerald-700",
                            border: "border-emerald-200 hover:border-emerald-300"
                          },
                          {
                            icon: TrendingUp,
                            emoji: "📊",
                            title: "Get Market Analysis",
                            desc: "Comprehensive market report",
                            gradient: "from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
                            textColor: "text-blue-700",
                            border: "border-blue-200 hover:border-blue-300"
                          },
                          {
                            icon: Calculator,
                            emoji: "💰",
                            title: "Mortgage Calculator",
                            desc: "Calculate monthly payments",
                            gradient: "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100",
                            textColor: "text-purple-700",
                            border: "border-purple-200 hover:border-purple-300"
                          },
                          {
                            icon: Download,
                            emoji: "📋",
                            title: "Download Brochure",
                            desc: "Detailed property information",
                            gradient: "from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100",
                            textColor: "text-orange-700",
                            border: "border-orange-200 hover:border-orange-300"
                          }
                        ].map((action, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              className={`w-full justify-start group bg-gradient-to-r ${action.gradient} ${action.textColor} ${action.border} transition-all duration-300 h-16 rounded-xl border-2 shadow-sm hover:shadow-md relative overflow-hidden`}
                              onClick={() => setIsQuickActionsOpen(false)}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/50 mr-4">
                                  <span className="text-2xl">{action.emoji}</span>
                                </div>
                                <div className="text-left flex-1">
                                  <div className="font-bold text-base">{action.title}</div>
                                  <div className="text-sm opacity-70">{action.desc}</div>
                                </div>
                                <motion.div
                                  whileHover={{ x: 5 }}
                                  className="opacity-60 group-hover:opacity-100 transition-all duration-200"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </motion.div>
                              </div>
                              
                              {/* Hover Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Stats Section with Enhanced Design */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="text-center mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Why Choose XlideLand?</h4>
                          <p className="text-xs text-gray-500">Trusted by thousands of clients</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-4 text-center border border-emerald-200"
                          >
                            <div className="text-emerald-600 font-bold text-xl">⚡ 2hrs</div>
                            <div className="text-emerald-700 text-xs font-medium">Avg Response</div>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 text-center border border-blue-200"
                          >
                            <div className="text-blue-600 font-bold text-xl">🏆 98%</div>
                            <div className="text-blue-700 text-xs font-medium">Success Rate</div>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-4 text-center border border-purple-200"
                          >
                            <div className="text-purple-600 font-bold text-xl">🌟 5.0</div>
                            <div className="text-purple-700 text-xs font-medium">Client Rating</div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
