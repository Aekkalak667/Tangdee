'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { createWallet, WalletData } from '@/services/walletService';
import CardPreview from '@/components/wallet/CardPreview';
import WalletForm from '@/components/wallet/WalletForm';
import styles from './CreateWallet.module.css';

export default function CreateWalletPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>({
    name: '',
    balance: 0,
    currency: 'THB',
    type: 'cash',
    icon: 'Wallet',
    color: '#171717',
  });

  const handleCreateWallet = async () => {
    if (!user) {
      alert(t('wallet.error_login_required'));
      return;
    }

    if (!walletData.name.trim()) {
      alert(t('wallet.error_name_required'));
      return;
    }

    setIsLoading(true);
    try {
      await createWallet(user.uid, walletData);
      
      router.push('/');
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert(t('wallet.error_create_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div style={{ marginBottom: '1rem' }}>
          <Link 
            href="/"
            style={{ 
              fontSize: '0.875rem', 
              color: 'var(--gray-500)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              textDecoration: 'none'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t('common.back_home')}
          </Link>
        </div>
        <h1 className={styles.title}>{t('wallet.create_title')}</h1>
        <p className={styles.subtitle}>{t('wallet.create_subtitle')}</p>
      </header>

      <div className={styles.responsiveGrid}>
        {/* Left Column: Preview */}
        <section className={styles.previewSection}>
          <h2 className={styles.previewLabel}>{t('common.preview')}</h2>
          <CardPreview 
            name={walletData.name}
            balance={walletData.balance}
            currency={walletData.currency}
            icon={walletData.icon}
            color={walletData.color}
          />
          <div className={styles.infoBox}>
            <p>{t('wallet.preview_info')}</p>
          </div>
        </section>

        {/* Right Column: Form */}
        <section>
          <WalletForm data={walletData} onChange={setWalletData} />
          
          <button 
            onClick={handleCreateWallet}
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? t('wallet.creating') : t('wallet.create_button')}
          </button>
        </section>
      </div>
    </main>
  );
}
