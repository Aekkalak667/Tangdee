'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  subscribeToTransactions, 
  GroupedTransactions 
} from '@/services/transactionService';
import { subscribeToWallets, WalletData } from '@/services/walletService';
import { 
  SearchBar, 
  FilterBar, 
  TransactionGroup, 
  TransactionItem 
} from '@/components/transactions';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';
import styles from './Transactions.module.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Filters State
  const [walletId, setWalletId] = useState<string | 'all'>('all');
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [search, setSearch] = useState<string>('');

  // Data State
  const [groupedTransactions, setGroupedTransactions] = useState<GroupedTransactions>({});
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Wallets
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToWallets(user.uid, (updatedWallets) => {
      setWallets(updatedWallets);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to Transactions
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTransactions(
      {
        uid: user.uid,
        walletId,
        month,
        year,
        search,
      },
      (data) => {
        setGroupedTransactions(data);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, walletId, month, year, search]);

  const handleMonthChange = (date: Date) => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (dateStr === todayStr) {
      return language === 'th' ? 'วันนี้' : 'Today';
    }
    
    if (dateStr === yesterdayStr) {
      return language === 'th' ? 'เมื่อวาน' : 'Yesterday';
    }

    return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('transactions.title')}</h1>
        <SearchBar value={search} onChange={setSearch} />
        <FilterBar 
          wallets={wallets} 
          onMonthChange={handleMonthChange} 
          onWalletChange={setWalletId} 
        />
      </header>

      <main className={styles.scrollContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader2 className="animate-spin" size={32} />
            <p className="mt-2">{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <AlertCircle className={styles.errorIcon} size={48} />
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              {t('common.retry')}
            </button>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className={styles.emptyContainer}>
            <Inbox className={styles.emptyIcon} size={48} />
            <p className={styles.emptyText}>{t('transactions.no_data')}</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const group = groupedTransactions[dateStr];
            return (
              <TransactionGroup
                key={dateStr}
                dateLabel={formatDateLabel(dateStr)}
                totalIncome={group.totalIncome}
                totalExpense={group.totalExpense}
              >
                {group.transactions.map((t, index) => (
                  <TransactionItem
                    key={t.id}
                    name={t.name}
                    category={t.categoryId || t.category}
                    amount={t.amount}
                    type={t.type}
                    time={t.date?.toDate ? t.date.toDate().toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : ''}
                    showSeparator={index !== group.transactions.length - 1}
                  />
                ))}
              </TransactionGroup>
            );
          })
        )}
      </main>
    </div>
  );
};

export default TransactionsPage;
