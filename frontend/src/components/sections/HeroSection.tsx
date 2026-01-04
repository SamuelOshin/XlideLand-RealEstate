'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
import { 
  ArrowRight,
  Search,
  Star
} from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background with Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/hero-5.jpg"
          alt="Modern luxury home"
          fill
          className="object-cover object-center"
          priority
          quality={95}
        />
        {/* Gradient Overlay: Transparent center to dark emerald/black bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center min-h-screen pt-24 pb-12">

        <div className="flex-grow flex flex-col justify-center max-w-4xl space-y-6 sm:space-y-8">
          {/* Tagline Pill */}
          <div className="w-fit inline-flex items-center space-x-2 bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 rounded-full px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 text-sm font-medium tracking-wide uppercase">#1 Real Estate Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-[1.1]">
            Discover Life <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              Better Lived.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed font-light">
            Find your perfect sanctuary across prime locations. We provide a curated network of luxury homes designed for comfort, style, and your future.
          </p>

          {/* CTA & Social Proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 pt-2">
            <InstantLoadingLink href="/properties">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-6 text-lg font-semibold group transition-all duration-300 shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] w-full sm:w-auto"
              >
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </InstantLoadingLink>

            {/* Social Proof */}
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-sm p-2 rounded-xl sm:bg-transparent sm:backdrop-blur-none sm:p-0">
              <div className="flex -space-x-3">
                 {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden relative bg-gray-700">
                    <Image
                      src={`/img/hero-${i}.png`}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-300 text-xs sm:text-sm font-medium">Trusted by 2.5k+ owners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Interaction */}
        <div className="mt-12 lg:mt-0 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

          {/* Search Bar */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center shadow-lg">
            <div className="relative flex-grow">
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
               <Input
                 placeholder="Search by location..."
                 className="bg-transparent border-none text-white placeholder:text-gray-300 pl-12 h-12 sm:h-14 text-base sm:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
               />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 sm:h-14 px-6 sm:px-8 font-semibold transition-colors">
              Search
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-12 pb-2">
            {[
              { label: 'Properties Sold', value: '2.5k+' },
              { label: 'Cities Covered', value: '50+' },
              { label: 'Years of Excellence', value: '15+' }
            ].map((stat, idx) => (
              <div key={idx} className={`text-white ${idx !== 0 ? 'lg:border-l lg:border-white/20 lg:pl-12' : ''}`}>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-1">{stat.value}</div>
                <div className="text-emerald-100/80 text-xs sm:text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
