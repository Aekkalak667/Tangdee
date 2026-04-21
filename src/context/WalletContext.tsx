'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  activeWalletId: string | 'all';
  setActiveWallet: (id: string | 'all') => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [activeWalletId, setActiveWalletState] = useState<string | 'all'>('all');

  useEffect(() => {
    const savedWalletId = localStorage.getItem('activeWalletId');
    if (savedWalletId) {
      setActiveWalletState(savedWalletId);
    }
  }, []);

  const setActiveWallet = (id: string | 'all') => {
    setActiveWalletState(id);
    localStorage.setItem('activeWalletId', id);
  };

  return (
    <WalletContext.Provider value={{ activeWalletId, setActiveWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
