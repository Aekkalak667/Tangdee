'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './FilterBar.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { WalletData } from '@/services/walletService';

interface FilterBarProps {
  wallets: WalletData[];
  onMonthChange: (date: Date) => void;
  onWalletChange: (walletId: string | 'all') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ wallets, onMonthChange, onWalletChange }) => {
  const { language } = useLanguage();
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth());
  const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
  const [activeWalletId, setActiveWalletId] = useState<string | 'all'>('all');
  
  const monthRowRef = useRef<HTMLDivElement>(null);

  // Generate 12 months (current month in the middle or at the end)
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return date;
  });

  useEffect(() => {
    // Scroll to the end of month row on initial load
    if (monthRowRef.current) {
      monthRowRef.current.scrollLeft = monthRowRef.current.scrollWidth;
    }
  }, []);

  const handleMonthClick = (date: Date) => {
    setActiveMonth(date.getMonth());
    setActiveYear(date.getFullYear());
    onMonthChange(date);
  };

  const handleWalletClick = (walletId: string | 'all') => {
    setActiveWalletId(walletId);
    onWalletChange(walletId);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
      month: 'short',
      year: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.filterContainer}>
      {/* Month Selection Row */}
      <div className={styles.scrollRow} ref={monthRowRef}>
        {months.map((date, index) => {
          const isActive = date.getMonth() === activeMonth && date.getFullYear() === activeYear;
          return (
            <button
              key={index}
              className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
              onClick={() => handleMonthClick(date)}
            >
              {formatMonth(date)}
            </button>
          );
        })}
      </div>

      {/* Wallet Selection Row */}
      <div className={styles.scrollRow}>
        <button
          className={`${styles.pill} ${activeWalletId === 'all' ? styles.pillActive : ''}`}
          onClick={() => handleWalletClick('all')}
        >
          {language === 'th' ? 'ทั้งหมด' : 'All'}
        </button>
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            className={`${styles.pill} ${activeWalletId === wallet.id ? styles.pillActive : ''}`}
            onClick={() => handleWalletClick(wallet.id!)}
          >
            {wallet.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
