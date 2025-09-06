'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/PropertyCard';
import { ChevronLeft, ChevronRight, ArrowRight, Filter } from 'lucide-react';
import { useFeaturedListings, convertListingToProperty } from '@/hooks/useListings';
import { Property } from '@/types';
import { useRouter } from 'next/navigation';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';

const FeaturedProperties = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { featuredListings, loading, error } = useFeaturedListings();
  
  // Convert backend listings to frontend Property format
  const properties: Property[] = featuredListings.map(listing => ({
    ...convertListingToProperty(listing),
    isFeatured: true // Mark as featured since these come from featured endpoint
  }));

  const itemsPerPage = 3;
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  
  const getCurrentPageProperties = () => {
    const startIndex = currentPage * itemsPerPage;
    return properties.slice(startIndex, startIndex + itemsPerPage);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Loading our finest properties...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-red-600 max-w-2xl mx-auto">
              Unable to load properties at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No featured properties available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Filter className="h-4 w-4" />
            <span>Featured Properties</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Discover Your Perfect Home
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our handpicked selection of premium properties, each offering unique features 
            and exceptional value in the most desirable locations.
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              key={`carousel-${currentPage}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 280,
                damping: 35,
                duration: 0.6
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
            >
              {getCurrentPageProperties().map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="h-full"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                className="p-2 rounded-full hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Page Indicators */}
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentPage
                        ? 'bg-green-600 scale-125'
                        : 'bg-gray-300 hover:bg-green-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                className="p-2 rounded-full hover:bg-green-50 hover:border-green-300 transition-all duration-300"
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* View All Properties CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <InstantLoadingLink href="/properties">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </InstantLoadingLink>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
