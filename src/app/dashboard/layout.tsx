'use client';

import { ReactNode } from 'react';

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
