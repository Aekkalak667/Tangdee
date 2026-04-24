'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  subscribeToTransactions, 
  GroupedTransactions,
  Transaction,
  deleteTransactionWithUpdate
} from '@/services/transactionService';
import { subscribeToWallets, WalletData } from '@/services/walletService';
import { 
  SearchBar, 
  FilterBar, 
  TransactionGroup, 
  TransactionItem,
  TransactionActionSheet
} from '@/components/transactions';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';
import styles from './Transactions.module.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  // Filters State
  const [walletId, setWalletId] = useState<string | 'all'>('all');
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [search, setSearch] = useState<string>('');

  // Action Sheet State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(20);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

    // Only show main loader for the first page
    if (pageSize === 20) {
      setLoading(true);
    }
    setError(null);

    const unsubscribe = subscribeToTransactions(
      {
        uid: user.uid,
        walletId,
        month,
        year,
        search,
        pageSize,
      },
      (data) => {
        setGroupedTransactions(data);
        
        // Count total items to check if there's more
        const totalCount = Object.values(data).reduce((acc, group) => acc + group.transactions.length, 0);
        setHasMore(totalCount >= pageSize);
        
        setLoading(false);
        setIsFetchingMore(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, walletId, month, year, search, pageSize]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setIsFetchingMore(true);
          setPageSize((prev) => prev + 20);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, isFetchingMore]);

  const handleMonthChange = (date: Date) => {
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setPageSize(20);
    setHasMore(true);
  };

  const handleWalletChange = (id: string | 'all') => {
    setWalletId(id);
    setPageSize(20);
    setHasMore(true);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPageSize(20);
    setHasMore(true);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsActionSheetOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    router.push(`/transactions/${transaction.id}/edit`);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!user || !transaction.id) return;
    
    const confirmDelete = window.confirm(t('transactions.confirm_delete'));
    if (!confirmDelete) return;

    try {
      await deleteTransactionWithUpdate(user.uid, transaction.id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert(t('common.error'));
    }
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
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterBar 
          wallets={wallets} 
          onMonthChange={handleMonthChange} 
          onWalletChange={handleWalletChange} 
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
          <>
            {sortedDates.map((dateStr) => {
              const group = groupedTransactions[dateStr];
              return (
                <TransactionGroup
                  key={dateStr}
                  dateLabel={formatDateLabel(dateStr)}
                  totalIncome={group.totalIncome}
                  totalExpense={group.totalExpense}
                >
                  {group.transactions.map((tx, index) => (
                    <TransactionItem
                      key={tx.id}
                      name={tx.name}
                      category={tx.categoryId || tx.category}
                      amount={tx.amount}
                      type={tx.type}
                      time={tx.date?.toDate ? tx.date.toDate().toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : ''}
                      showSeparator={index !== group.transactions.length - 1}
                      onClick={() => handleTransactionClick(tx)}
                    />
                  ))}
                </TransactionGroup>
              );
            })}
            
            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className={styles.sentinel}>
              {isFetchingMore ? (
                <div className={styles.fetchingMoreLoader}>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{t('common.loading')}...</span>
                </div>
              ) : hasMore ? (
                <span>{t('transactions.scroll_for_more')}</span>
              ) : sortedDates.length > 0 ? (
                <span>{t('transactions.no_more_data')}</span>
              ) : null}
            </div>
          </>
        )}
      </main>

      <TransactionActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default TransactionsPage;
