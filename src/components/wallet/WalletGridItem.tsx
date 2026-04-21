'use client';

import React from 'react';
import { LayoutGrid, LucideIcon } from 'lucide-react';
import { WALLET_ICONS } from './WalletForm';
import styles from './WalletGridItem.module.css';

interface WalletGridItemProps {
  id: string | 'all';
  name: string;
  balance: number;
  currency?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  onClick: () => void;
}

const WalletGridItem: React.FC<WalletGridItemProps> = ({
  id,
  name,
  balance,
  currency = 'THB',
  icon,
  color,
  isActive,
  onClick,
}) => {
  const IconComponent = id === 'all' 
    ? LayoutGrid 
    : (WALLET_ICONS[icon || ''] || WALLET_ICONS.Wallet);

  const formattedBalance = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  const customStyle = id !== 'all' ? {
    backgroundColor: color,
    color: 'white',
    borderColor: 'transparent'
  } : {};

  return (
    <button 
      className={`${styles.card} ${isActive ? styles.active : ''} ${id !== 'all' ? styles.customColor : ''}`}
      style={customStyle}
      onClick={onClick}
      type="button"
    >
      <div className={styles.iconWrapper}>
        <IconComponent size={24} strokeWidth={2} />
      </div>
      
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.balance}>
          {formattedBalance} {currency}
        </span>
      </div>
    </button>
  );
};

export default WalletGridItem;
