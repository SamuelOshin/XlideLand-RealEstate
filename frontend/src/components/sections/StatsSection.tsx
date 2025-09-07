'use client';

import React from 'react';
import { motion } from 'framer-motion';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { 
  TrendingUp, 
  Users, 
  Home, 
  Award, 
  DollarSign, 
  MapPin,
  Clock,
  Star
} from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Home,
      number: '2,500+',
      label: 'Properties Sold',
      description: 'Successfully closed deals',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Users,
      number: '8,500+',
      label: 'Happy Clients',
      description: 'Satisfied customers',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: DollarSign,
      number: '₦2.5B+',
      label: 'Property Value',
      description: 'Total sales volume',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Award,
      number: '15+',
      label: 'Years Experience',
      description: 'In real estate market',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: TrendingUp,
      number: '98%',
      label: 'Success Rate',
      description: 'Client satisfaction',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: MapPin,
      number: '50+',
      label: 'Locations',
      description: 'Cities we serve',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Support',
      description: 'Always available',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Star,
      number: '4.9/5',
      label: 'Rating',
      description: 'Customer reviews',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  const achievements = [
    {
      title: 'Top Real Estate Agency',
      subtitle: 'Lagos Property Review 2024',
      year: '2024'
    },
    {
      title: 'Best Customer Service',
      subtitle: 'Real Estate Excellence Awards',
      year: '2023'
    },
    {
      title: 'Innovation in PropTech',
      subtitle: 'National Real Estate Association',
      year: '2023'
    },
    {
      title: 'Fastest Growing Agency',
      subtitle: 'Nigerian Real Estate Association',
      year: '2022'
    }
  ];  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 relative overflow-hidden mt-20 lg:mt-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>Our Achievements</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Numbers That Speak for Themselves
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Over the years, we've built a legacy of excellence in real estate, 
            helping thousands of clients find their dream homes and make smart investments.
          </p>
        </motion.div>        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20 md:mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2 min-h-[140px] sm:min-h-[160px] flex flex-col justify-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${stat.bgColor} rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform mx-auto`}>
                  <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${stat.color}`} />
                </div>
                  <div className="text-center space-y-1 sm:space-y-2">
                  <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${stat.color} group-hover:scale-105 transition-transform`}>
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Awards Section */}        
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-gray-100"
        >
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Awards & Recognition
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Our commitment to excellence has been recognized by industry leaders 
              and valued clients across the region.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group cursor-pointer p-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Award className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[2rem] text-center">
                    {achievement.year}
                  </div>
                </div>
                
                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors leading-tight">
                  {achievement.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {achievement.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>         */}
        {/* Call to Action */}        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white mx-4 sm:mx-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
              Let our proven track record work for you. Whether buying, selling, or investing, 
              we're here to make your real estate journey a success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <InstantLoadingLink href="/properties">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors min-h-[52px] text-base shadow-lg"
                >
                  Start Your Journey
                </motion.button>
              </InstantLoadingLink>
              <InstantLoadingLink href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors min-h-[52px] text-base"
                >
                  Learn More
                </motion.button>
              </InstantLoadingLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
