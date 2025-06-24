'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface InstantLoadingLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  [key: string]: any;
}

const InstantLoadingLink = ({ href, children, className, onClick, ...props }: InstantLoadingLinkProps) => {
  const currentPathname = usePathname();  const handleClick = (e: React.MouseEvent) => {
    const currentPath = currentPathname;
    const targetPath = href.split('?')[0].split('#')[0];
    
    // Only trigger for different routes
    if (targetPath !== currentPath && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      // Call the global instant loading function
      if (typeof window !== 'undefined' && (window as any).startInstantLoading) {
        (window as any).startInstantLoading();
      }
    }
    
    // Call custom onClick
    onClick?.(e);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default InstantLoadingLink;
