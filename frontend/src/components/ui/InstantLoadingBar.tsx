'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const InstantLoadingBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Listen for route changes to finish loading
  useEffect(() => {
    if (previousPathnameRef.current !== pathname && isLoading) {
      // Route changed - complete the loading
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }
    previousPathnameRef.current = pathname;
  }, [pathname, isLoading]);
  // Handle progress animation when loading starts
  useEffect(() => {
    if (isLoading) {
      setProgress(20); // Immediate start at 20%
      
      let currentProgress = 20;
      progressTimerRef.current = setInterval(() => {
        currentProgress += Math.random() * 10 + 3; // Increment 3-13%
        
        if (currentProgress >= 80) {
          currentProgress = 80; // Cap at 80%
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
        }
        
        setProgress(currentProgress);
      }, 100);
    } else {
      // Clear timer when loading stops
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isLoading]);  // Expose start function globally
  useEffect(() => {
    const startInstantLoading = () => {
      setIsLoading(true);
    };

    // Add to window for global access
    (window as any).startInstantLoading = startInstantLoading;

    return () => {
      delete (window as any).startInstantLoading;
    };
  }, []);

  if (!isLoading) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-2 bg-gray-200">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transition-all duration-100 ease-out relative overflow-hidden"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
        
        {/* Glowing tip */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-emerald-300/80 to-transparent" />
      </div>
    </div>
  );
};

export default InstantLoadingBar;
