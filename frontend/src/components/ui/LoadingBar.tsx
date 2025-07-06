'use client';

import { useEffect, useState } from 'react';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

const LoadingBar = () => {
  const { isLoading } = useNavigationLoading();
  const [progress, setProgress] = useState(0);  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout | undefined;
    let hideTimer: NodeJS.Timeout | undefined;    if (isLoading) {
      setVisible(true);
      setProgress(15); // Start with 15% immediately for instant feedback

      // Simulate progressive loading with realistic timing
      let currentProgress = 15;
      progressTimer = setInterval(() => {
        currentProgress += Math.random() * 15 + 5; // Random increment between 5-20
        
        if (currentProgress >= 85) {
          currentProgress = 85; // Cap at 85% until loading completes
          if (progressTimer) {
            clearInterval(progressTimer);
          }
        }
        
        setProgress(currentProgress);
      }, 150); // Faster updates for more responsive feel    } else {
      // Complete the loading bar
      if (progressTimer) {
        clearInterval(progressTimer);
      }
      setProgress(100);
        // Hide the bar after completion animation
      hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300); // Slightly faster completion
    }

    return () => {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <>
      {/* Loading Bar Container */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-100">
        <div
          className={`h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transition-all duration-300 ease-out relative overflow-hidden ${
            progress === 100 ? 'transition-opacity duration-400' : ''
          }`}
          style={{
            width: `${progress}%`,
            boxShadow: progress > 0 ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'
          }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          
          {/* Glowing effect at the end */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-emerald-400/50 to-transparent" />
          )}
        </div>
      </div>

      {/* Subtle page overlay during loading */}
      {isLoading && (
        <div 
          className="fixed inset-0 bg-white/20 backdrop-blur-[0.5px] z-[9998] pointer-events-none transition-opacity duration-200"
          style={{ opacity: Math.min(progress / 100, 0.3) }}
        />
      )}
    </>
  );
};

export default LoadingBar;
