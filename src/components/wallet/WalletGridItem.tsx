'use client';

import React from 'react';
import { LayoutGrid, LucideIcon, Pencil, Trash2 } from 'lucide-react';
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
  isManageMode?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const WalletGridItem: React.FC<WalletGridItemProps> = ({
  id,
  name,
  balance,
  currency = 'THB',
  icon,
  color,
  isActive,
  isManageMode = false,
  onClick,
  onEdit,
  onDelete,
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div 
      className={`${styles.card} ${isActive ? styles.active : ''} ${id !== 'all' ? styles.customColor : ''} ${isManageMode ? styles.manageMode : ''}`}
      style={customStyle}
      onClick={isManageMode && id !== 'all' ? onEdit : onClick}
      role="button"
      tabIndex={id === 'all' && isManageMode ? -1 : 0}
      aria-disabled={id === 'all' && isManageMode}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !(id === 'all' && isManageMode)) {
          e.preventDefault();
          if (isManageMode && id !== 'all') onEdit?.();
          else onClick();
        }
      }}
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

      {isManageMode && id !== 'all' && (
        <div className={styles.manageOverlay}>
          <button 
            className={`${styles.manageButton} ${styles.editButton}`}
            onClick={handleEdit}
            title="Edit Wallet"
            type="button"
          >
            <Pencil size={16} />
          </button>
          <button 
            className={`${styles.manageButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            title="Delete Wallet"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletGridItem;
