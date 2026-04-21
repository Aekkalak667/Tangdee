'use client';

import React from 'react';
import styles from './AppLoader.module.css';
import { useLanguage } from '@/context/LanguageContext';

const AppLoader = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <div className={styles.walletLoader}>
        <div className={styles.walletBack}></div>
        <div className={`${styles.bill} ${styles.bill1}`}></div>
        <div className={`${styles.bill} ${styles.bill2}`}></div>
        <div className={`${styles.bill} ${styles.bill3}`}></div>
        <div className={styles.walletFront}></div>
      </div>
      <div className={styles.text}>
        {t('common.loading')}
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
      </div>
    </div>
  );
};

export default AppLoader;
