"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWallet } from "@/context/WalletContext";
import { subscribeToWallets, WalletData } from "@/services/walletService";
import { getDailySummary, MonthlySummary } from "@/services/transactionService";
import SpendingSummary from "@/components/dashboard/SpendingSummary";
import CardPreview from "@/components/wallet/CardPreview";
import MiniCalendar from "@/components/dashboard/MiniCalendar";
import DailyRecap from "@/components/dashboard/DailyRecap";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeWalletId, setActiveWallet } = useWallet();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const activeWallet = activeWalletId === 'all' 
    ? null 
    : wallets.find(w => w.id === activeWalletId);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToWallets(user.uid, (updatedWallets, total) => {
      setWallets(updatedWallets);
      setTotalBalance(total);
    });

    // Fetch monthly summary
    const now = new Date();
    getDailySummary(
      user.uid, 
      now.getMonth(), 
      now.getFullYear(),
      activeWalletId === 'all' ? undefined : activeWalletId
    ).then(setMonthlySummary);

    return () => unsubscribe();
  }, [user, activeWalletId]);

  const displayBalance = activeWallet ? activeWallet.balance : totalBalance;
  const displayLabel = activeWallet ? activeWallet.name : t('dashboard.total_balance');

  const formattedBalance = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayBalance);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('common.app_name')}</h1>
        <div style={{ 
          width: '2.5rem', 
          height: '2.5rem', 
          borderRadius: '50%', 
          backgroundColor: 'var(--gray-100)', 
          border: '1px solid var(--gray-200)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: '600', 
          color: 'var(--gray-600)', 
          fontSize: '0.875rem',
          overflow: 'hidden'
        }}>
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'U'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            user?.displayName?.charAt(0) || 'U'
          )}
        </div>
      </header>

      <div className={styles.headerSection}>
        <div className={styles.totalBalanceContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className={styles.totalBalanceLabel}>{displayLabel}</p>
            {activeWalletId !== 'all' && (
              <button 
                onClick={() => setActiveWallet('all')}
                style={{
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--gray-100)',
                  color: 'var(--gray-600)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('dashboard.show_all')}
              </button>
            )}
          </div>
          <div className={styles.totalBalanceValue}>
            {formattedBalance}
            <span className={styles.currency}>THB</span>
          </div>
        </div>

        {(activeWallet || (activeWalletId === 'all' && wallets.length > 0)) && (
          <div style={{ transform: 'scale(0.95)', transformOrigin: 'right center' }}>
            <CardPreview 
              name={activeWallet ? activeWallet.name : wallets[0].name}
              balance={activeWallet ? activeWallet.balance : wallets[0].balance}
              currency={activeWallet ? activeWallet.currency : wallets[0].currency}
              icon={activeWallet ? activeWallet.icon : wallets[0].icon}
              color={activeWallet ? activeWallet.color : wallets[0].color}
            />
          </div>
        )}
      </div>

      <SpendingSummary wallets={activeWallet ? [activeWallet] : wallets} />

      <section className={styles.dashboardGrid}>
        <MiniCalendar 
          summary={monthlySummary} 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <DailyRecap 
          date={selectedDate}
          summary={monthlySummary[selectedDate]}
        />
      </section>
    </main>
  );
}
