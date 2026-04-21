import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { WALLET_ICONS } from './WalletForm';
import styles from './CardPreview.module.css';

interface CardPreviewProps {
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  name,
  balance,
  currency,
  icon,
  color,
}) => {
  const { t } = useLanguage();
  
  const IconComponent = WALLET_ICONS[icon] || WALLET_ICONS.Wallet;

  const formattedBalance = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  return (
    <div 
      className={styles.card} 
      style={{ backgroundColor: color || '#171717' }}
    >
      <div className={styles.topRow}>
        <span className={styles.walletName}>{name || t('wallet.name_label')}</span>
        <div className={styles.iconWrapper}>
          <IconComponent size={32} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className={styles.bottomRow}>
        <span className={styles.balanceLabel}>{t('wallet.current_balance')}</span>
        <div className={styles.balanceValue}>
          {formattedBalance}
          <span className={styles.currency}>{currency}</span>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
