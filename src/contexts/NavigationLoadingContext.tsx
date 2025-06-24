'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationLoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  finishLoading: () => {},
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
}

export const NavigationLoadingProvider = ({ children }: NavigationLoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If pathname has changed and we're currently loading, finish loading
    if (previousPathnameRef.current !== pathname && isLoading) {
      // Clear any existing timer
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      // Add a small delay to ensure the page has had time to render
      loadingTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingTimerRef.current = null;
      }, 300);
    }
    
    previousPathnameRef.current = pathname;
  }, [pathname, isLoading]);  const startLoading = () => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoading(true);
  };

  const finishLoading = () => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setIsLoading(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  return (
    <NavigationLoadingContext.Provider value={{ isLoading, startLoading, finishLoading }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
};
