'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're on a dashboard page or auth page
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname?.startsWith('/auth');
  
  // For dashboard and auth pages, don't show the main Header and Footer
  if (isDashboardPage || isAuthPage) {
    return <>{children}</>;
  }
  
  // For all other pages, show the Header and Footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
