'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${language === 'th' ? styles.active : ''}`}
        onClick={() => setLanguage('th')}
        aria-label="Switch to Thai"
      >
        TH
      </button>
      <button
        className={`${styles.button} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
