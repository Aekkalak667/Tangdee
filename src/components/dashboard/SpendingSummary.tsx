"use client";

import React from "react";
import { WalletData } from "@/services/walletService";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./SpendingSummary.module.css";

interface SpendingSummaryProps {
  wallets: WalletData[];
}

const SpendingSummary: React.FC<SpendingSummaryProps> = ({ wallets }) => {
  const { t } = useLanguage();

  const totalBalance = wallets.reduce((sum, wallet) => sum + (Number(wallet.balance) || 0), 0);

  if (wallets.length === 0 || totalBalance <= 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>{t('dashboard.spending_summary')}</h3>
        <div className={styles.emptyState}>
          {t('dashboard.no_data')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('dashboard.spending_summary')}</h3>
      
      <div className={styles.barContainer}>
        {wallets.map((wallet) => {
          const percentage = ((Number(wallet.balance) || 0) / totalBalance) * 100;
          if (percentage <= 0) return null;
          
          return (
            <div
              key={wallet.id}
              className={styles.segment}
              style={{
                width: `${percentage}%`,
                backgroundColor: wallet.color || "#3b82f6",
              }}
              title={`${wallet.name}: ${percentage.toFixed(1)}%`}
            />
          );
        })}
      </div>

      <div className={styles.legend}>
        {wallets.map((wallet) => (
          <div key={wallet.id} className={styles.legendItem}>
            <div 
              className={styles.dot} 
              style={{ backgroundColor: wallet.color || "#3b82f6" }} 
            />
            <span>{wallet.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingSummary;
