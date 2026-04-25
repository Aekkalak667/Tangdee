'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useWallet } from '@/context/WalletContext';
import { subscribeToWallets, WalletData } from '@/services/walletService';
import { addTransactionWithUpdate, transferFunds } from '@/services/transactionService';
import { subscribeToCustomCategories, CustomCategory } from '@/services/categoryService';
import { categories as staticCategories } from '@/constants/categories';
import TypeToggle from '@/components/transactions/TypeToggle';
import CategoryGrid from '@/components/transactions/CategoryGrid';
import { WALLET_ICONS } from '@/components/wallet/WalletForm';
import { ChevronDown, ArrowDown } from 'lucide-react';
import styles from './AddTransaction.module.css';

export default function AddTransactionPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeWalletId } = useWallet();
  const router = useRouter();

  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'expense' | 'income' | 'transfer'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState(activeWalletId === 'all' ? '' : activeWalletId);
  const [toWalletId, setToWalletId] = useState('');
  const [note, setNote] = useState('');
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState<'from' | 'to' | null>(null);

  const selectedWallet = wallets.find(w => w.id === walletId);
  const destinationWallet = wallets.find(w => w.id === toWalletId);

  useEffect(() => {
    if (!user) return;
    const unsubWallets = subscribeToWallets(user.uid, (updatedWallets) => {
      setWallets(updatedWallets);
      if (!walletId && updatedWallets.length > 0) {
        setWalletId(updatedWallets[0].id || '');
      }
      if (!toWalletId && updatedWallets.length > 1) {
        const other = updatedWallets.find(w => w.id !== walletId);
        if (other) setToWalletId(other.id || '');
      }
    });

    const unsubCats = subscribeToCustomCategories(user.uid, (cats) => {
      setCustomCategories(cats);
    });

    return () => {
      unsubWallets();
      unsubCats();
    };
  }, [user, walletId, toWalletId]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  const handleSave = async () => {
    const numericAmount = parseFloat(amount);
    if (!user || !walletId || isNaN(numericAmount) || numericAmount <= 0) return;
    if (type !== 'transfer' && !categoryId) return;
    if (type === 'transfer' && (!toWalletId || walletId === toWalletId)) {
      alert(t('wallet.error_same_wallet'));
      return;
    }

    setIsLoading(true);
    try {
      // Find category name and icon
      let categoryName = '';
      let iconName = '';
      
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

      const txData = {
        uid: user.uid,
        amount: numericAmount,
        type,
        categoryId,
        iconName,
        walletId,
        note,
        name: categoryName || categoryId,
        category: categoryName || categoryId,
      };

      if (type === 'transfer') {
        await transferFunds(user.uid, {
          fromWalletId: walletId,
          toWalletId: toWalletId,
          amount: numericAmount,
          note,
        });
      } else {
        await addTransactionWithUpdate(user.uid, txData);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert(t('common.error_generic'));
    } finally {
      setIsLoading(false);
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

  return (
    <main className={styles.container}>
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
          top: showWalletMenu === 'from' ? '8rem' : '15rem',
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
        onClick={handleSave}
        disabled={isLoading || (type !== 'transfer' && !categoryId) || parseFloat(amount) <= 0}
      >
        {isLoading ? t('common.loading') : t('transactions.save_button')}
      </button>
    </main>
  );
}
