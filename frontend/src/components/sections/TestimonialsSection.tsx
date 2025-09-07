'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote,
  Award,
  MapPin,
  Calendar
} from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'First-Time Homebuyer',
      location: 'Cambridge, MA',
      image: '/img/woman.jpg',
      rating: 5,
      date: 'January 2024',
      testimonial: 'Working with XlideLand was an absolute dream! As a first-time homebuyer, I was overwhelmed by the process, but Sarah Johnson guided me through every step with patience and expertise. She helped me find the perfect home within my budget in the exact neighborhood I wanted. The entire team made what could have been a stressful experience completely seamless.',
      property: 'Modern Condo in Harvard Square',
      achievement: 'Found dream home 10% under budget'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Property Investor',
      location: 'Victoria Island, Lagos',
      image: '/img/client-2.jpg',
      rating: 5,
      date: 'December 2023',
      testimonial: 'I\'ve worked with several real estate agencies over the years, but XlideLand stands out for their market knowledge and investment expertise. They helped me identify undervalued properties and negotiate excellent deals. Their insights into neighborhood trends and rental potential have been invaluable to my portfolio growth.',
      property: 'Multi-family Investment Property',
      achievement: '15% ROI on investment property'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Family Relocation',
      location: 'Ikoyi, Lagos',
      image: '/img/client-3.jpg',
      rating: 5,
      date: 'November 2023',
  testimonial: 'Relocating from abroad with two young children seemed daunting, but Michael Chen made it effortless. He understood our family\'s needs perfectly and showed us properties that matched our lifestyle. The virtual tours were incredibly helpful, and he coordinated everything so smoothly that we closed on our dream home before we even arrived in Lagos!',
      property: 'Family Home with Large Yard',
      achievement: 'Smooth cross-country relocation'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Luxury Home Buyer',
      location: 'Back Bay, MA',
      image: '/img/client-4.jpg',
      rating: 5,
      date: 'October 2023',
      testimonial: 'When searching for a luxury property, attention to detail matters. XlideLand exceeded my expectations with their white-glove service and exclusive access to off-market properties. Emily Rodriguez understood my vision and found me a stunning penthouse that wasn\'t even publicly listed. Their network and discretion are unmatched.',
      property: 'Luxury Penthouse with City Views',
      achievement: 'Exclusive off-market purchase'
    },
    {
      id: 5,
      name: 'Jennifer Walsh',
      role: 'Home Seller',
      location: 'Somerville, MA',
      image: '/img/client-5.jpg',
      rating: 5,
      date: 'September 2023',
      testimonial: 'Selling my family home was emotional, but the XlideLand team handled everything with such care and professionalism. Their marketing strategy was phenomenal - professional photography, virtual staging, and targeted advertising. We received multiple offers within days and sold for well above asking price. Couldn\'t be happier!',
      property: 'Victorian Family Home',
      achievement: 'Sold 12% above asking price'
    },
    {
      id: 6,
      name: 'Robert Kim',
      role: 'Commercial Investor',
      location: 'Financial District, MA',
      image: '/img/client-6.jpg',
      rating: 5,
      date: 'August 2023',
      testimonial: 'For commercial real estate, you need a team that understands the complexities of zoning, financing, and market dynamics. XlideLand\'s commercial division delivered exceptional results on my office building acquisition. Their due diligence was thorough, and they negotiated terms that exceeded my expectations.',
      property: 'Commercial Office Building',
      achievement: 'Successful commercial acquisition'
    }
  ];

  const platforms = [
    { name: 'Google Reviews', rating: 4.9, reviews: 847, logo: '/img/google-logo.png' },
    { name: 'Zillow', rating: 4.8, reviews: 523, logo: '/img/zillow-logo.png' },
    { name: 'Realtor.com', rating: 4.9, reviews: 392, logo: '/img/realtor-logo.png' },
    { name: 'Yelp', rating: 4.7, reviews: 186, logo: '/img/yelp-logo.png' }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentTestimonialData = testimonials[currentTestimonial];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Quote className="h-4 w-4" />
            <span>Client Testimonials</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Clients Say About Us
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say 
            about their experience working with XlideLand.
          </p>
        </motion.div>

        {/* Rating Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {platforms.map((platform, index) => (
            <div key={platform.name} className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-gray-700">{platform.name.charAt(0)}</span>
              </div>
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(platform.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-900">{platform.rating}</span>
              </div>
              <div className="text-xs text-gray-500">{platform.reviews} reviews</div>
            </div>
          ))}
        </motion.div>

        {/* Main Testimonial */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl"
            >
              <div className="grid lg:grid-cols-3 gap-12 items-center">
                {/* Client Info */}
                <div className="text-center lg:text-left">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-blue-100">
                      <div 
                        className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"
                        style={{
                          backgroundImage: `url(${currentTestimonialData.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentTestimonialData.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {currentTestimonialData.role}
                  </p>
                  
                  <div className="flex items-center justify-center lg:justify-start text-gray-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {currentTestimonialData.location}
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start mb-4">
                    {[...Array(currentTestimonialData.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 flex items-center justify-center lg:justify-start">
                    <Calendar className="h-4 w-4 mr-1" />
                    {currentTestimonialData.date}
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Quote className="h-12 w-12 text-blue-200 mb-6" />
                    <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                      "{currentTestimonialData.testimonial}"
                    </blockquote>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Property Purchased</h4>
                      <p className="text-gray-600 text-sm">{currentTestimonialData.property}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Achievement</h4>
                      <p className="text-gray-600 text-sm">{currentTestimonialData.achievement}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={prevTestimonial}
              className="bg-white/80 hover:bg-white shadow-lg border-gray-200 group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            </Button>

            {/* Pagination Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextTestimonial}
              className="bg-white/80 hover:bg-white shadow-lg border-gray-200 group"
            >
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"
                    style={{
                      backgroundImage: `url(${testimonial.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "{testimonial.testimonial.substring(0, 120)}..."
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Ready to Share Your Success Story?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have achieved their real estate goals with XlideLand.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3"
          >
            Start Your Journey Today
          </Button>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TestimonialsSection;
