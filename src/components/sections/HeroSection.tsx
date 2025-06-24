'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SearchForm from '@/components/SearchForm';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Award, 
  Users, 
  Home, 
  Star,
  MapPin,
  ArrowRight
} from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const heroSlides = [
    {
      id: 1,
      image: '/img/hero-5.jpg',
      title: 'Find Your Dream Home',
      subtitle: 'Discover Premium Properties in Prime Locations',
      description: 'Explore our curated collection of luxury homes, apartments, and commercial properties. Your perfect space awaits.',
      cta: 'Explore Properties',
      stats: { homes: '1000+', clients: '5000+', rating: '4.9' }
    },
    {
      id: 2,
      image: '/img/7.jpg',
      title: 'Luxury Living Redefined',
      subtitle: 'Experience Unmatched Elegance and Comfort',
      description: 'Step into a world of sophisticated living with our exclusive portfolio of high-end residential properties.',
      cta: 'View Luxury Homes',
      stats: { homes: '500+', clients: '2500+', rating: '5.0' }
    },
    {
      id: 3,
      image: '/img/hero.jpg',
      title: 'Investment Opportunities',
      subtitle: 'Smart Real Estate Investments for Your Future',
      description: 'Discover profitable investment opportunities in prime real estate markets with guaranteed returns.',
      cta: 'Investment Guide',
      stats: { homes: '300+', clients: '1200+', rating: '4.8' }
    }
  ];

  const achievements = [
    { icon: Home, value: '2500+', label: 'Properties Sold' },
    { icon: Users, value: '8500+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Star, value: '4.9', label: 'Average Rating' }
  ];

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = async () => {
      const loaded = await Promise.all(
        heroSlides.map((slide) => {
          return new Promise<boolean>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = slide.image;
          });
        })
      );
      setImagesLoaded(loaded);
    };

    preloadImages();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === 'Escape' && isVideoPlaying) {
        setIsVideoPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-label="Hero section with property showcase"
    >      {/* Background Slider */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            data-slide={currentSlide}
          >            {/* Enhanced gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/30 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray via-black/20 to-black/60 z-10" />
              <Image
              src={currentSlideData.image}
              alt={`${currentSlideData.title} - ${currentSlideData.subtitle}`}
              fill
              className="object-cover object-center w-full h-full transition-transform duration-1000 hover:scale-105"
              priority={currentSlide === 0}
              sizes="100vw"
              quality={95}
              style={{
                objectFit: 'cover',
                objectPosition: 'center center'
              }}
              onError={() => {
                // Fallback to a gradient background if image fails to load
                const target = document.querySelector(`[data-slide="${currentSlide}"]`) as HTMLElement;
                if (target) {
                  target.style.background = 'linear-gradient(135deg, #065f46 0%, #064e3b 50%, #1f2937 100%)';
                }
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>      
      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-32 sm:pb-40 lg:pb-32">
        <div className="flex flex-col items-center text-center min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-200px)] justify-center">
          {/* Hero Content - Centered */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white space-y-4 sm:space-y-6 lg:space-y-8 max-w-4xl mx-auto"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 hover:bg-black/60 transition-colors duration-300"
            >
              <Star className="h-4 w-4 text-yellow-400 fill-current animate-pulse" />
              <span className="text-sm font-medium">Rated #1 Real Estate Platform</span>
            </motion.div>            
            {/* Main Headlines */}
            <div className="space-y-3 sm:space-y-4">                <motion.h1
                key={currentSlideData.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight"
                style={{
                  textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.4)'
                }}
              >
                {currentSlideData.title}
              </motion.h1>
                <motion.h2
                key={currentSlideData.subtitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-100 font-medium"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.3)'
                }}
              >
                {currentSlideData.subtitle}
              </motion.h2><motion.p
                key={currentSlideData.description}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.3)'
                }}
              >
                {currentSlideData.description}
              </motion.p>
            </div>            
            {/* Stats - Enhanced for mobile/tablet */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-12"
              role="group"
              aria-label="Company statistics"
            >
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{currentSlideData.stats.homes}</div>
                <div className="text-xs sm:text-sm text-gray-300">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{currentSlideData.stats.clients}</div>
                <div className="text-xs sm:text-sm text-gray-300">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">{currentSlideData.stats.rating}</div>
                <div className="text-xs sm:text-sm text-gray-300">Rating</div>
              </div> */}
              
              {/* Additional stats for mobile/tablet - hidden on desktop where bottom cards show */}
              {/* <div className="text-center lg:hidden">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">15+</div>
                <div className="text-xs sm:text-sm text-gray-300">Years Exp.</div>
              </div>
            </motion.div> */}
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-4 text-base group shadow-lg hover:shadow-xl transition-all duration-300 min-h-[52px] w-full sm:w-auto"
                aria-label={`${currentSlideData.cta} - View available properties`}
              >
                {currentSlideData.cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-base group shadow-lg hover:shadow-xl transition-all duration-300 min-h-[52px] w-full sm:w-auto"
                onClick={() => setIsVideoPlaying(true)}
                aria-label="Watch our company story video"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Our Story
              </Button>
            </motion.div>
          </motion.div>          
          {/* Search Form - Centered below content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="w-full max-w-5xl mx-auto mt-12 sm:mt-16 lg:mt-20"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-shadow duration-300 mx-4 sm:mx-0">
              <div className="mb-4 sm:mb-6 md:mb-8 text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Find Your Perfect Home</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600">Search through thousands of properties</p>
              </div>
              <SearchForm variant="hero" />
            </div>
          </motion.div>
        </div>
      </div>      
      {/* Slider Navigation - Enhanced for better accessibility */}
      <div className="absolute left-2 right-2 md:left-4 md:right-4 lg:left-8 lg:right-8 top-1/3 transform -translate-y-1/2 z-40 flex items-center justify-between pointer-events-none">
        {/* Left Arrow */}
        <Button
          variant="outline"
          size="lg"
          onClick={prevSlide}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-0 transition-all duration-300 hover:scale-110 shadow-xl pointer-events-auto focus:ring-2 focus:ring-white/50"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="outline"
          size="lg"
          onClick={nextSlide}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md rounded-full w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 p-0 transition-all duration-300 hover:scale-110 shadow-xl pointer-events-auto focus:ring-2 focus:ring-white/50"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
        </Button>
      </div>

      {/* Slide Indicators - Enhanced accessibility */}
      <div 
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        role="tablist"
        aria-label="Slide navigation"
      >
        <div className="flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none ${
                index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/80 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-selected={index === currentSlide}
              role="tab"
              title={slide.title}
            />
          ))}
        </div>
      </div>      {/* Achievement Cards - Enhanced responsive design */}
      <div className="absolute bottom-0 left-0 right-0 z-30 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 bg-white/95 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-2xl"
            role="region"
            aria-label="Company achievements"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="text-center group hover:scale-105 transition-transform duration-300 py-1 sm:py-2"
              >
                <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg md:rounded-xl mb-1 sm:mb-2 lg:mb-3 group-hover:scale-110 transition-transform">
                  <achievement.icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">{achievement.value}</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600">{achievement.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Video Modal - Enhanced accessibility */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoPlaying(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="XlideLand Story"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVideoPlaying(false)}
                className="absolute -top-12 right-0 bg-white/10 border-white/30 text-white hover:bg-white/20 focus:ring-2 focus:ring-white/50"
                aria-label="Close video"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
