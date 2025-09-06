'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Typography from '@/components/ui/Typography';
import { Home, ArrowLeft, Search, Phone } from 'lucide-react';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to home
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <Typography
            as="h1"
            variant="heading"
            size="4xl"
            weight="bold"
            className="text-emerald-600 mb-4"
          >
            404
          </Typography>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Typography
            as="h2"
            variant="heading"
            size="2xl"
            weight="semibold"
            className="text-text-primary"
          >
            Oops! Page Not Found
          </Typography>

          <Typography
            as="p"
            variant="body"
            size="lg"
            className="text-text-secondary max-w-md mx-auto leading-relaxed"
          >
            The page you're looking for seems to have moved or doesn't exist.
            Don't worry, let's get you back on track to find your perfect property.
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            onClick={handleGoBack}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <InstantLoadingLink href="/">
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </InstantLoadingLink>
        </div>

        {/* Additional Help */}
        <div className="mt-12 space-y-4">
          <Typography
            as="p"
            variant="caption"
            className="text-text-muted"
          >
            Need help finding something specific?
          </Typography>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <InstantLoadingLink href="/properties">
              <Button
                variant="ghost"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Browse Properties
              </Button>
            </InstantLoadingLink>

            <InstantLoadingLink href="/contact">
              <Button
                variant="ghost"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Button>
            </InstantLoadingLink>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 opacity-10">
          <div className="flex justify-center space-x-8">
            <div className="w-16 h-16 bg-emerald-200 rounded-full"></div>
            <div className="w-12 h-12 bg-orange-200 rounded-full mt-4"></div>
            <div className="w-20 h-20 bg-emerald-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
