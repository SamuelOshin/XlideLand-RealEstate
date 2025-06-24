'use client';

import React, { useState, useEffect } from 'react';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Heart, 
  Bell, 
  User, 
  ChevronDown,
  Home,
  Building2,
  Users,
  MessageCircle,
  Phone,
  Menu,
  LogOut,
  Settings,
  BarChart3
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, role } = useAuth();
  const { redirectToLogin, redirectToRegister } = useRequireAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', current: pathname === '/', icon: Home },
    { name: 'Properties', href: '/properties', current: pathname === '/properties', icon: Building2 },
    // { name: 'Realtors', href: '/realtors', current: pathname === '/realtors', icon: Users },
    { name: 'About', href: '/about', current: pathname === '/about', icon: MessageCircle },
    { name: 'Contact', href: '/contact', current: pathname === '/contact', icon: Phone },
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'seller': return 'Agent';
      case 'buyer': return 'Buyer';
      default: return 'User';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'buyer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        
        <div className="flex items-center justify-between h-16 lg:h-20">         
           {/* Logo */}          <div className="flex-shrink-0 z-10">
            <InstantLoadingLink href="/" className="flex items-center space-x-2 group">
            <div className={`relative p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'bg-transparent' 
                : 'bg-white/10 backdrop-blur-sm shadow-lg'
            }`}>
              <Image
                src="/img/xlidelogo.png"
                alt="XlideLand Logo"
                width={120}
                height={40}
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"              />              </div>
            </InstantLoadingLink>
          </div>          {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {navigation.map((item) => (              
              <InstantLoadingLink
                key={item.name}
                href={item.href}
                className={`relative font-medium transition-all duration-300 group px-4 py-2 rounded-full ${
                  item.current
                    ? isScrolled
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                      : 'text-green-300 hover:text-white'
                    : isScrolled
                    ? 'text-slate-800 hover:text-green-600 font-semibold hover:bg-gray-100'
                    : 'text-white hover:text-green-300'
                }`}
              >
                {item.name}
                {!item.current && (
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 ${
                      item.current ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                )}
              </InstantLoadingLink>
            ))}
          </nav>{/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {/* Search */}
            <div className="relative">              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isScrolled 
                    ? 'hover:bg-gray-100 text-gray-900' 
                    : 'hover:bg-white/10 text-white'
                }`}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 p-4 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10 pr-4"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Actions */}
            {isAuthenticated && (
              <>
                {/* Favorites */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isScrolled 
                      ? 'hover:bg-gray-100 text-gray-900' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-full relative transition-all duration-300 ${
                    isScrolled 
                      ? 'hover:bg-gray-100 text-gray-900' 
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </>
            )}

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                      isScrolled 
                        ? 'hover:bg-gray-100 text-gray-900' 
                        : 'hover:bg-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                          {getRoleDisplayName(role)}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 p-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                      {/* User Info */}
                      <div className="px-3 py-2 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                        <div className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                          {getRoleDisplayName(role)}
                        </div>
                      </div>
                        {/* Menu Items */}
                      <div className="py-1">                        <InstantLoadingLink 
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <BarChart3 className="h-4 w-4 mr-3" />
                          Dashboard
                        </InstantLoadingLink>                        <InstantLoadingLink 
                          href="/dashboard/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </InstantLoadingLink>                        <InstantLoadingLink 
                          href="/dashboard/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >                          
                        <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </InstantLoadingLink>
                      </div>
                      
                      <hr className="my-1" />
                      
                      <button 
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (                <div className="flex items-center space-x-3">
                  <button
                    onClick={redirectToLogin}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                        : 'text-white hover:text-green-300 hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={redirectToRegister}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {isAuthenticated && (
              <Button 
                className={`px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                  isScrolled
                    ? 'bg-green-600 hover:bg-green-700 text-white border border-green-600'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                }`}
              >
                {role === 'seller' || role === 'admin' ? 'List Property' : 'Contact Agent'}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-700' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">          <div className="px-4 pt-4 pb-6 space-y-3">
            {navigation.map((item) => (
              <InstantLoadingLink
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors min-h-[48px] flex items-center ${
                  item.current
                    ? 'bg-green-50 text-green-700 border-l-4 border-green-500 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {item.name}
              </InstantLoadingLink>
            ))}
            
            {/* Mobile Search */}
            <div className="pt-4 border-t border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  className="pl-12 pr-4 h-12 text-base"
                />
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                      <div className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(role)}`}>
                        {getRoleDisplayName(role)}
                      </div>
                    </div>
                  </div>                    <InstantLoadingLink
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 text-left bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    <BarChart3 className="h-5 w-5 mr-3" />
                    Dashboard
                  </InstantLoadingLink>
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      redirectToLogin()
                    }}
                    className="text-center px-4 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      redirectToRegister()
                    }}
                    className="text-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
