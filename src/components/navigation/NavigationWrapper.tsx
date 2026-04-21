'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BottomNav from './BottomNav';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide navigation on login page or if user is not logged in
  const showNav = user && pathname !== '/login';

  return (
    <div className={showNav ? 'app-with-nav' : ''}>
      {children}
      {showNav && <BottomNav />}
    </div>
  );
};

export default NavigationWrapper;
