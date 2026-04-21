'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './TypeToggle.module.css';

interface TypeToggleProps {
  activeType: 'expense' | 'income' | 'transfer';
  onTypeChange: (type: 'expense' | 'income' | 'transfer') => void;
}

const TypeToggle: React.FC<TypeToggleProps> = ({ activeType, onTypeChange }) => {
  const { t } = useLanguage();

  const getSliderClass = () => {
    switch (activeType) {
      case 'expense': return styles.slideExpense;
      case 'income': return styles.slideIncome;
      case 'transfer': return styles.slideTransfer;
      default: return styles.slideExpense;
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.slider} ${getSliderClass()}`} />
      <button
        type="button"
        className={`${styles.button} ${activeType === 'expense' ? styles.active : ''}`}
        onClick={() => onTypeChange('expense')}
      >
        {t('dashboard.expense')}
      </button>
      <button
        type="button"
        className={`${styles.button} ${activeType === 'income' ? styles.active : ''}`}
        onClick={() => onTypeChange('income')}
      >
        {t('dashboard.income')}
      </button>
      <button
        type="button"
        className={`${styles.button} ${activeType === 'transfer' ? styles.active : ''}`}
        onClick={() => onTypeChange('transfer')}
      >
        {t('dashboard.transfer')}
      </button>
    </div>
  );
};

export default TypeToggle;
