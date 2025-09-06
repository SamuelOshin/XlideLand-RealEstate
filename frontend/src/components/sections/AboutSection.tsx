'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { 
  CheckCircle, 
  ArrowRight, 
  Users, 
  Award, 
  Target, 
  Heart,
  Shield,
  TrendingUp,
  Globe,
  Clock
} from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: 'Client-Centered Approach',
      description: 'Every decision we make puts our clients\' needs and satisfaction first.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Building lasting relationships through honesty, transparency, and ethical practices.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Focused on achieving exceptional outcomes that exceed expectations.',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to enhance the real estate experience.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const features = [
    'Expert market knowledge and analysis',
    'Personalized service tailored to your needs',
    'Advanced marketing strategies and tools',
    'Comprehensive property evaluation',
    'Negotiation expertise and advocacy',
    'End-to-end transaction management',
    'Post-sale support and follow-up',
    '24/7 availability and communication'
  ];

  const milestones = [
    {
      year: '2008',
      title: 'Company Founded',
      description: 'Started with a vision to revolutionize real estate in Boston'
    },
    {
      year: '2012',
      title: 'First 1000 Sales',
      description: 'Reached a major milestone in helping families find homes'
    },
    {
      year: '2016',
      title: 'Regional Expansion',
      description: 'Extended services across Greater Boston area'
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Launched virtual tours and online property management'
    },
    {
      year: '2024',
      title: 'Market Leader',
      description: 'Recognized as the #1 real estate agency in the region'
    }
  ];
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center mb-16 sm:mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 sm:px-4 py-2 rounded-full text-sm font-medium mb-3 sm:mb-4">
                <Users className="h-4 w-4" />
                <span>About XlideLand</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Your Trusted Real Estate Partner Since 2008
              </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                At XlideLand, we believe that finding the perfect property is more than just a transaction—it's 
                about discovering the place where your dreams take shape and your future unfolds.
              </p>
              
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                With over 15 years of experience in the Greater Boston real estate market, our team of dedicated 
                professionals has helped thousands of families and investors achieve their property goals. From 
                first-time homebuyers to seasoned investors, we provide personalized service that makes the 
                complex world of real estate simple and accessible.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {features.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <InstantLoadingLink href="/about">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 sm:px-8 py-3 group min-h-[48px] text-sm sm:text-base"
                >
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </InstantLoadingLink>
              
            </div>
          </motion.div>          {/* Right Content - Enhanced Interactive Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative space-y-6"
          >
            {/* Main Hero Image with Enhanced Overlays */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <Image
                src="/img/about-hero.jpg"
                alt="XlideLand Office"
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    parent.style.height = '400px';
                  }
                }}
              />
              
              {/* Premium Overlay Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                <Award className="h-3 w-3" />
                <span>PREMIUM SERVICE</span>
              </div>

              {/* Live Market Indicator */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>MARKET ACTIVE</span>
              </div>              {/* Enhanced Floating Stats Cards - Repositioned to avoid covering face */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">8,500+</div>
                    <div className="text-sm text-gray-600">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Success Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">This Year's Impact</h4>
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+24% Growth</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₦847M</div>
                  <div className="text-xs text-gray-600">Total Sales Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2,340</div>
                  <div className="text-xs text-gray-600">Properties Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">98.7%</div>
                  <div className="text-xs text-gray-600">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">14 Days</div>
                  <div className="text-xs text-gray-600">Avg. Time to Sell</div>
                </div>
              </div>
            </motion.div>

            {/* Client Testimonial Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-500">
                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                    <div className="text-sm text-gray-600">Recent Client</div>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "XlideLand made our dream home purchase seamless. Their expertise and dedication exceeded our expectations!"
                </p>
              </div>
            </motion.div>

            {/* Quick Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
              
              <div className="relative">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="h-5 w-5" />
                  <span className="font-semibold">Ready to Get Started?</span>
                </div>
                <p className="text-sm text-blue-100 mb-4">
                  Get your free property valuation and market analysis today.
                </p>
                <InstantLoadingLink href="/contact">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold w-full">
                    Get Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </InstantLoadingLink>
              </div>
            </motion.div>
          </motion.div>
        </div>        {/* Values Section with World Map Background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 relative"
        >
          {/* World Map Background */}
          <div className="absolute inset-0 opacity-5 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIFNpbXBsaWZpZWQgd29ybGQgbWFwIHdpdGggZG90cyAtLT4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJkb3RzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNCIgaGVpZ2h0PSI0Ij4KICAgICAgPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0iIzM0NDU0NyIgb3BhY2l0eT0iMC44Ii8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxnPgogICAgPCEtLSBOb3J0aCBBbWVyaWNhIC0tPgogICAgPHBhdGggZD0iTTEwMCAyMDBMMzAwIDIwMEwzNTAgMTUwTDMwMCAxMDBMMjAwIDEwMEwxNTAgMTUwWiIgZmlsbD0idXJsKCNkb3RzKSIvPgogICAgPCEtLSBTb3V0aCBBbWVyaWNhIC0tPgogICAgPHBhdGggZD0iTTIwMCAzMDBMMzIwIDMwMEwzMTAgNTAwTDI1MCA1MDBMMjMwIDQwMCwiIGZpbGw9InVybCgjZG90cykiLz4KICAgIDwhLS0gRXVyb3BlIC0tPgogICAgPHBhdGggZD0iTTQ1MCAyMDBMNTUwIDIwMEw1NzAgMTUwTDUyMCAxMDBMNDcwIDEyMFoiIGZpbGw9InVybCgjZG90cykiLz4KICAgIDwhLS0gQWZyaWNhIC0tPgogICAgPHBhdGggZD0iTTQ4MCAzMDBMNTgwIDMwMEw1OTAgNTAwTDUwMCA1MjBMNDYwIDQ1MFoiIGZpbGw9InVybCgjZG90cykiLz4KICAgIDwhLS0gQXNpYSAtLT4KICAgIDxwYXRoIGQ9Ik02MDAgMjAwTDkwMCAyMDBMOTUwIDEwMEw4NTAgMTAwTDc1MCA5MEw2NTAgMTMwWiIgZmlsbD0idXJsKCNkb3RzKSIvPgogICAgPCEtLSBBdXN0cmFsaWEgLS0+CiAgICA8cGF0aCBkPSJNNzAwIDUwMEw4NTAgNTAwTDg2MCA1NTBMNzUwIDU3MEw3MTAgNTMwWiIgZmlsbD0idXJsKCNkb3RzKSIvPgogIDwvZz4KICA8IS0tIEFkZGl0aW9uYWwgZG90IHBhdHRlcm4gb3ZlcmxheSAtLT4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjZG90cykiIG9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K')] bg-center bg-no-repeat bg-contain"></div>
          </div>
          
          {/* Content with enhanced overlay */}
          <div className="relative z-10 bg-gradient-to-br from-gray-50/80 to-white/90 rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Globe className="h-4 w-4" />
                <span>Global Excellence</span>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide every interaction and drive our commitment to excellence across all markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${value.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <value.icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to market leadership—a story of growth, innovation, and success.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } flex-col lg:flex-row gap-8`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="text-sm font-medium text-blue-600 mb-2">{milestone.year}</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg lg:mx-0 mx-auto"></div>
                  </div>

                  <div className="flex-1 lg:block hidden"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        
      </div>
    </section>
  );
};

export default AboutSection;
