'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar,
  Home,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  Award
} from 'lucide-react';

const CTASection = () => {
  const services = [
    {
      icon: Home,
      title: 'Property Search',
      description: 'Find your perfect home from our extensive listings',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: DollarSign,
      title: 'Property Valuation',
      description: 'Get accurate market value assessments',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      title: 'Investment Consulting',
      description: 'Expert advice for real estate investments',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      title: 'Legal Support',
      description: 'Comprehensive legal assistance throughout',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our experts',
      action: '+234 907 661 4145',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your questions anytime',
      action: 'Opeyemib117@gmail.com',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant support online',
      action: 'Start Chat',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Calendar,
      title: 'Book Meeting',
      description: 'Schedule a consultation',
      action: 'Schedule Now',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const benefits = [
    'No upfront fees or hidden costs',
    'Dedicated agent assigned to you',
    'Market insights and analysis',
    'End-to-end transaction support',
    '24/7 customer service',
    'Post-sale support and follow-up'
  ];
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main CTA Section */}        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 text-sm font-medium mb-6 sm:mb-8">
            <Award className="h-4 w-4 text-yellow-400" />
            <span>Get Started Today</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Find Your 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Dream Property?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
            Join thousands of satisfied clients who have found their perfect home with XlideLand. 
            Our expert team is ready to guide you through every step of your real estate journey.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg group min-h-[48px]"
            >
              Start Property Search
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[48px]"
            >
              Free Property Valuation
            </Button>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Stay Updated with Market Trends</h3>
              <p className="text-gray-300 mb-6">
                Get exclusive property listings, market insights, and expert tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400 py-3"
                />
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            How We Can Help You
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${service.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-7 w-7 ${service.color}`} />
                </div>
                <h4 className="text-xl font-bold mb-3">{service.title}</h4>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Get In Touch With Us
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${method.bgColor} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                </div>
                <h4 className="text-lg font-bold mb-2">{method.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{method.description}</p>
                <div className="text-blue-400 font-medium text-sm group-hover:text-blue-300 transition-colors">
                  {method.action}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold mb-6">
              Why Choose XlideLand?
            </h3>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're not just another real estate agency. We're your trusted partners 
              committed to making your property dreams a reality.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                <h4 className="text-2xl font-bold mb-2">Free Consultation</h4>
                <p className="text-gray-300">Book a no-obligation consultation with our experts</p>
              </div>
              
              <div className="space-y-4">
                <Input
                  placeholder="Your Full Name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3">
                  Book Free Consultation
                </Button>
              </div>
              
              <p className="text-xs text-gray-400 text-center mt-4">
                Available Monday - Sunday, 8 AM - 8 PM EST
              </p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20 pt-16 border-t border-white/20"
        >
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">
            Your Dream Property Is Just One Click Away
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Don't wait for the perfect moment – it might never come. Start your real estate 
            journey today and let us help you find the property of your dreams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-10 py-4 text-lg group"
            >
              Browse Properties Now
              <Home className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm px-10 py-4 text-lg font-semibold group"
            >
              <Phone className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              Call Now: +234 907 661 4145
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
