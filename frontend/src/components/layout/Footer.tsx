'use client';

import React from 'react';
import Link from 'next/link';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Heart,
  Home,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Team', href: '/team' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact Us', href: '/contact' },
      ]
    },
    {
      title: 'Properties',
      links: [
        { name: 'Buy Property', href: '/buy' },
        { name: 'Rent Property', href: '/rent' },
        { name: 'Sell Property', href: '/sell' },
        { name: 'Commercial', href: '/commercial' },
        { name: 'Luxury Homes', href: '/luxury' },
        { name: 'New Projects', href: '/new-projects' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Safety Center', href: '/safety' },
        { name: 'Community Guidelines', href: '/guidelines' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
      ]
    }
  ];

  const stats = [
    { icon: Home, label: 'Properties Listed', value: '10,000+' },
    { icon: Users, label: 'Happy Customers', value: '25,000+' },
    { icon: Award, label: 'Awards Won', value: '50+' },
    { icon: TrendingUp, label: 'Years Experience', value: '15+' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Stats Section */}
      {/* <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src="/img/xlidelogo.png"
                alt="XlideLand Logo"
                width={200}
                height={90}
                className="h-12 w-auto brightness-0 invert group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Your trusted partner in finding the perfect property. We make buying, selling, and renting properties seamless and stress-free with our cutting-edge platform and expert guidance.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Stay Updated</h4>
              <div className="flex space-x-2 max-w-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-primary-500"
                />
                <Button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 px-6 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Get the latest property updates and market insights.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Phone className="h-5 w-5 text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5 text-primary-500" />
                <span>hello@xlideland.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                <MapPin className="h-5 w-5 text-primary-500" />
                <span>123 Real Estate Ave, Property City, PC 12345</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-lg text-white">{section.title}</h4>
              <ul className="space-y-3">                {section.links.map((link) => (
                  <li key={link.name}>
                    <InstantLoadingLink
                      href={link.href}
                      className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </InstantLoadingLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} XlideLand. All rights reserved. Made with{' '}
              <Heart className="h-4 w-4 text-red-500 inline mx-1" />
              for property seekers.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm hidden sm:block">Follow us:</span>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-secondary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-300 hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to Top */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              Back to Top ↑
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 left-10 w-2 h-2 bg-primary-500 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-secondary-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary-400 rounded-full opacity-40 animate-pulse delay-500"></div>
    </footer>
  );
};

export default Footer;
