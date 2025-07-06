'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  [key: string]: any;
}

const LoadingLink = ({ href, children, className, onClick, ...props }: LoadingLinkProps) => {
  const { startLoading } = useNavigationLoading();
  const currentPathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger loading for different routes
    // Also handle hash links and query params properly
    const currentPath = currentPathname;
    const targetPath = href.split('?')[0].split('#')[0]; // Remove query params and hash
      if (targetPath !== currentPath && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      startLoading();
    }
    
    // Call any custom onClick handler
    onClick?.(e);
  };
  // Remove the conditional rendering - always use the same pattern
  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default LoadingLink;
