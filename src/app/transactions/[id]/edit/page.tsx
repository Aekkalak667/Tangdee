'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { subscribeToWallets, WalletData } from '@/services/walletService';
import { updateTransactionWithUpdate, Transaction } from '@/services/transactionService';
import { subscribeToCustomCategories, CustomCategory } from '@/services/categoryService';
import { categories as staticCategories } from '@/constants/categories';
import TypeToggle from '@/components/transactions/TypeToggle';
import CategoryGrid from '@/components/transactions/CategoryGrid';
import { WALLET_ICONS } from '@/components/wallet/WalletForm';
import { ChevronDown, ArrowDown, Loader2, ArrowLeft } from 'lucide-react';
import styles from '../../../add/AddTransaction.module.css';

interface EditTransactionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [note, setNote] = useState('');
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState<'from' | 'to' | null>(null);

  const selectedWallet = wallets.find(w => w.id === walletId);
  const destinationWallet = wallets.find(w => w.id === toWalletId);

  // Fetch Wallets & Categories
  useEffect(() => {
    if (!user) return;
    const unsubWallets = subscribeToWallets(user.uid, (updatedWallets) => {
      setWallets(updatedWallets);
    });

    const unsubCats = subscribeToCustomCategories(user.uid, (cats) => {
      setCustomCategories(cats);
    });

    return () => {
      unsubWallets();
      unsubCats();
    };
  }, [user]);

  // Fetch Transaction Data
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;
      try {
        const txRef = doc(db, 'transactions', id);
        const txSnap = await getDoc(txRef);
        
        if (txSnap.exists()) {
          const data = txSnap.data() as Transaction;
          setAmount(data.amount.toString());
          setType(data.type);
          setCategoryId(data.categoryId || data.category);
          setWalletId(data.walletId);
          if (data.type === 'transfer') {
            setToWalletId(data.toWalletId || '');
          }
          setNote(data.note || '');
        } else {
          alert(t('common.error_not_found'));
          router.push('/transactions');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        alert(t('common.error_generic'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id, router, t]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  const handleUpdate = async () => {
    const numericAmount = parseFloat(amount);
    if (!user || !walletId || isNaN(numericAmount) || numericAmount <= 0) return;
    if (type !== 'transfer' && !categoryId) return;
    if (type === 'transfer' && (!toWalletId || walletId === toWalletId)) {
      alert(t('wallet.error_same_wallet'));
      return;
    }

    setIsSaving(true);
    try {
      let categoryName = '';
      let iconName = '';

      if (type === 'transfer') {
        categoryName = 'Transfer';
        iconName = 'ArrowLeftRight';
      } else {
        const customCat = customCategories.find(c => c.id === categoryId);
        if (customCat) {
          categoryName = customCat.name;
          iconName = customCat.iconName;
        } else {
          const staticCat = staticCategories.find(c => c.id === categoryId);
          if (staticCat) {
            categoryName = t(`dashboard.categories.${staticCat.labelKey}`);
            iconName = staticCat.iconName;
          }
        }
      }

      const txData: Partial<Transaction> = {
        amount: numericAmount,
        type,
        categoryId,
        walletId,
        note,
        name: categoryName || categoryId,
        category: categoryName || categoryId,
        iconName,
      };

      if (type === 'transfer') {
        txData.fromWalletId = walletId;
        txData.toWalletId = toWalletId;
        txData.walletId = walletId;
        txData.name = `โอนย้ายไปยัง ${destinationWallet?.name || '...'}`;
      }

      await updateTransactionWithUpdate(user.uid, id, txData);
      router.push('/transactions');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert(t('common.error_generic'));
    } finally {
      setIsSaving(false);
    }
  };

  const WalletSelectorPill = ({ wallet, isSource }: { wallet?: WalletData, isSource: boolean }) => {
    const Icon = wallet ? (WALLET_ICONS[wallet.icon] || WALLET_ICONS.Wallet) : null;
    return (
      <div 
        className={styles.walletPill} 
        onClick={() => setShowWalletMenu(isSource ? 'from' : 'to')}
      >
        {wallet ? (
          <>
            <div className={styles.walletIcon} style={{ backgroundColor: wallet.color, color: 'white' }}>
              {Icon && <Icon size={12} />}
            </div>
            <span className={styles.walletName}>{wallet.name}</span>
            <ChevronDown size={14} color="var(--gray-400)" />
          </>
        ) : (
          <span className={styles.walletName}>Select</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{t('transactions.edit_transaction')}</h1>
      </header>

      <TypeToggle activeType={type} onTypeChange={setType} />

      <div className={styles.walletSelector}>
        {type === 'transfer' ? (
          <div className={styles.transferContainer}>
            <p className={styles.label} style={{ fontSize: '0.6rem', marginBottom: '0.25rem' }}>{t('transactions.from_wallet')}</p>
            <WalletSelectorPill wallet={selectedWallet} isSource={true} />
            <div className={styles.transferArrow}>
              <ArrowDown size={16} />
            </div>
            <p className={styles.label} style={{ fontSize: '0.6rem', marginBottom: '0.25rem' }}>{t('transactions.to_wallet')}</p>
            <WalletSelectorPill wallet={destinationWallet} isSource={false} />
          </div>
        ) : (
          <WalletSelectorPill wallet={selectedWallet} isSource={true} />
        )}
      </div>

      {showWalletMenu && (
        <div style={{
          position: 'absolute',
          top: showWalletMenu === 'from' ? '12rem' : '19rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 3rem)',
          maxWidth: '300px',
          background: 'white',
          borderRadius: '1.5rem',
          border: '1px solid var(--gray-100)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
          zIndex: 100,
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}>
          {wallets
            .filter(w => {
              if (showWalletMenu === 'from') return w.id !== toWalletId;
              if (showWalletMenu === 'to') return w.id !== walletId;
              return true;
            })
            .map(w => (
            <div 
              key={w.id}
              onClick={() => { 
                if (showWalletMenu === 'from') setWalletId(w.id!);
                else setToWalletId(w.id!);
                setShowWalletMenu(null); 
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: (showWalletMenu === 'from' ? walletId : toWalletId) === w.id ? 'var(--gray-50)' : 'transparent'
              }}
            >
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', backgroundColor: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {React.createElement(WALLET_ICONS[w.icon] || WALLET_ICONS.Wallet, { size: 14 })}
              </div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                {w.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.amountDisplay}>
        <span className={styles.currency}>THB</span>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          className={styles.amountInput}
          placeholder="0.00"
        />
      </div>

      {type !== 'transfer' && (
        <CategoryGrid 
          type={type} 
          activeCategoryId={categoryId} 
          onSelect={setCategoryId} 
        />
      )}

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's this for?"
          className={styles.noteInput}
        />
      </div>

      <button 
        className={styles.saveButton} 
        onClick={handleUpdate}
        disabled={isSaving || (type !== 'transfer' && !categoryId) || parseFloat(amount) <= 0}
      >
        {isSaving ? t('common.loading') : t('transactions.save_button')}
      </button>
    </main>
  );
}
