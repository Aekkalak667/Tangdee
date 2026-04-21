import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './NetWorthCard.module.css';

interface NetWorthCardProps {
  totalBalance: number;
  currency?: string;
}

const NetWorthCard: React.FC<NetWorthCardProps> = ({ 
  totalBalance, 
  currency = 'THB' 
}) => {
  const { t } = useLanguage();

  const formattedAmount = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalBalance);

  return (
    <div className={styles.container}>
      <span className={styles.label}>{t('dashboard.total_balance')}</span>
      <div className={styles.amount}>
        {formattedAmount}
        <span className={styles.currency}>{currency}</span>
      </div>
    </div>
  );
};

export default NetWorthCard;
