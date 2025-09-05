'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { 
  Home,
  Heart,
  Calendar,
  MessageSquare,
  TrendingUp,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  User,
  Building2,
  PlusCircle,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
  BarChart3,
  Users,
  Eye,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // Navigation items based on user role
  const getNavigationItems = (role: string) => {
    const commonItems = [
      { 
        href: '/dashboard', 
        label: 'Dashboard', 
        icon: Home, 
        description: 'Overview & insights',
        badge: null
      },
      { 
        href: '/dashboard/profile', 
        label: 'My Profile', 
        icon: User, 
        description: 'Personal information',
        badge: null
      }
    ];    const buyerItems = [
      { 
        href: '/dashboard/properties/saved', 
        label: 'Saved Properties', 
        icon: Heart, 
        description: 'Your favorites',        
        badge: null
      },
      { 
        href: '/dashboard/tours', 
        label: 'Tours & Visits', 
        icon: Calendar, 
        description: 'Scheduled appointments',        
        badge: null
      },
      { 
        href: '/dashboard/messages', 
        label: 'Messages', 
        icon: MessageSquare, 
        description: 'Chat with agents',        
        badge: null
      },
      { 
        href: '/dashboard/insights', 
        label: 'Market Insights', 
        icon: TrendingUp, 
        description: 'Trends & analytics',
        badge: null
      }
    ];    const sellerItems = [
      { 
        href: '/dashboard/properties/listed', 
        label: 'My Listings', 
        icon: Building2, 
        description: 'Properties for sale',
        badge: null
      },
      { 
        href: '/dashboard/properties/new', 
        label: 'Add Property', 
        icon: PlusCircle, 
        description: 'List new property',
        badge: null
      },
      { 
        href: '/dashboard/inquiries', 
        label: 'Inquiries', 
        icon: MessageSquare, 
        description: 'Buyer interests',
        badge: null
      },
      { 
        href: '/dashboard/tours', 
        label: 'Tour Requests', 
        icon: Calendar, 
        description: 'Schedule viewings',
        badge: null
      },
      { 
        href: '/dashboard/insights', 
        label: 'Performance', 
        icon: BarChart3, 
        description: 'Listing analytics',
        badge: null
      }
    ];    const adminItems = [
      { 
        href: '/dashboard/analytics', 
        label: 'System Analytics', 
        icon: BarChart3, 
        description: 'Platform insights',
        badge: null
      },
      { 
        href: '/dashboard/admin/users', 
        label: 'User Management', 
        icon: Users, 
        description: 'Manage accounts',
        badge: null
      },
      { 
        href: '/dashboard/admin/properties', 
        label: 'Property Moderation', 
        icon: Shield, 
        description: 'Review listings',
        badge: null
      },
      { 
        href: '/dashboard/admin/reports', 
        label: 'Reports', 
        icon: FileText, 
        description: 'Generate reports',
        badge: null
      }
    ];

    const propertyManagementItems = [
      { 
        href: '/dashboard/properties/listed', 
        label: 'My Listings', 
        icon: Building2, 
        description: 'Properties for sale',
        badge: null
      },
      { 
        href: '/dashboard/properties/new', 
        label: 'Add Property', 
        icon: PlusCircle, 
        description: 'List new property',
        badge: null
      }
    ];const bottomItems = [      { 
        href: '/dashboard/alerts', 
        label: 'Alerts', 
        icon: Bell, 
        description: 'Notifications & alerts',
        badge: null
      },
      { 
        href: '/dashboard/documents', 
        label: 'Documents', 
        icon: FileText, 
        description: 'Files & contracts',
        badge: null
      },
      { 
        href: '/dashboard/settings', 
        label: 'Settings', 
        icon: Settings, 
        description: 'Account preferences',
        badge: null
      },
      { 
        href: '/dashboard/support', 
        label: 'Support', 
        icon: HelpCircle, 
        description: 'Get assistance',
        badge: null
      }
    ];

    switch (role) {
      case 'seller':
        return [...commonItems, ...sellerItems, ...bottomItems];
      case 'admin':
        return [...commonItems, ...propertyManagementItems, ...adminItems, ...bottomItems];
      default: // buyer
        return [...commonItems, ...buyerItems, ...bottomItems];
    }
  };

  const navigationItems = getNavigationItems(role);

  return (    
  <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 80
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3"
                >
                  <InstantLoadingLink href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">X</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">XlideLand</h2>
                      <p className="text-sm text-gray-500 capitalize">{role} Dashboard</p>
                    </div>
                  </InstantLoadingLink>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">X</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <InstantLoadingLink href={item.href}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                        isActive 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                        isSidebarOpen ? 'mr-3' : 'mx-auto'
                      }`} />
                      
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex-1 min-w-0"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium truncate">{item.label}</p>
                                <p className={`text-xs truncate ${
                                  isActive ? 'text-emerald-100' : 'text-gray-500'
                                }`}>
                                  {item.description}
                                </p>
                              </div>
                              {item.badge && (
                                <Badge 
                                  className={`ml-2 ${
                                    isActive 
                                      ? 'bg-white/20 text-white' 
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {!isSidebarOpen && item.badge && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.badge}
                        </div>
                      )}
                    </motion.div>
                  </InstantLoadingLink>
                </motion.div>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-200">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <UserAvatar 
                  size="md" 
                  className="ring-2 ring-white"
                  showLoadingState={false}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 flex-1 text-left"
                    >                      <p className="font-medium text-gray-900 truncate">{user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isSidebarOpen && (
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`} />
                )}
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <InstantLoadingLink href="/dashboard/profile" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                      <User className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="text-sm font-medium">View Profile</span>
                    </InstantLoadingLink>
                    <InstantLoadingLink href="/dashboard/settings" className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      <span className="text-sm font-medium">Settings</span>
                    </InstantLoadingLink>
                    <hr className="border-gray-200" />
                    <button className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors text-red-600">
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>        </div>
      </motion.aside>
        {/* Main Content */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'
      }`}>
      {/* Header */}
        <header className="bg-gradient-to-r from-white via-white to-gray-50/50 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-30 w-full shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden hover:bg-gray-100 text-gray-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.first_name || user?.username || 'User'}! 👋
                </h1>
                <p className="text-gray-600">Welcome back to your {role} dashboard</p>
              </div>
            </div>            <div className="flex items-center space-x-3">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-gray-100 text-gray-700 h-10 w-10 rounded-full transition-all duration-200 hover:shadow-sm"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>

              {/* Desktop Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 transition-colors duration-200" />
                <Input
                  placeholder="Search properties, tours, messages..."
                  className="pl-10 w-80 bg-white/90 backdrop-blur-sm border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-md"
                />
              </div>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-gray-100 text-gray-700 h-10 w-10 rounded-full transition-all duration-200 hover:shadow-sm"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                  3
                </div>
              </Button>

              {/* Quick Add */}
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden lg:flex bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </header>{/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
