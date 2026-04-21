"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWallet } from "@/context/WalletContext";
import { subscribeToWallets, WalletData, updateWalletMetadata, deleteWallet } from "@/services/walletService";
import WalletGridItem from "@/components/wallet/WalletGridItem";
import WalletForm from "@/components/wallet/WalletForm";
import DeleteModal from "@/components/wallet/DeleteModal";
import styles from "./WalletPage.module.css";

export default function WalletPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeWalletId, setActiveWallet } = useWallet();
  const router = useRouter();
  
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletData | null>(null);
  const [deletingWallet, setDeletingWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToWallets(user.uid, (updatedWallets, total) => {
      setWallets(updatedWallets);
      setTotalBalance(total);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddWallet = () => {
    router.push("/create-wallet");
  };

  const handleSelectWallet = (id: string | 'all') => {
    if (isManageMode) return;
    setActiveWallet(id);
    router.push('/dashboard');
  };

  const onUpdateWallet = async () => {
    if (!user || !editingWallet?.id) return;
    setIsLoading(true);
    try {
      await updateWalletMetadata(user.uid, editingWallet.id, {
        name: editingWallet.name,
        icon: editingWallet.icon,
        color: editingWallet.color
      });
      setEditingWallet(null);
    } catch (error) {
      alert(t('common.error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteWallet = async (deleteTransactions: boolean) => {
    if (!user || !deletingWallet?.id) return;
    setIsLoading(true);
    try {
      await deleteWallet(user.uid, deletingWallet.id, { deleteTransactions });
      if (activeWalletId === deletingWallet.id) setActiveWallet('all');
      setDeletingWallet(null);
    } catch (error) {
      alert(t('common.error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.wallet')}</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className={styles.manageButton}
            onClick={() => setIsManageMode(!isManageMode)}
          >
            {isManageMode ? t('wallet.done') : t('wallet.manage')}
          </button>
          {!isManageMode && (
            <button 
              className={styles.addButton}
              onClick={handleAddWallet}
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </header>

      <div className={styles.grid}>
        <WalletGridItem
          id="all"
          name={t('common.app_name')}
          balance={totalBalance}
          isActive={activeWalletId === 'all'}
          onClick={() => handleSelectWallet('all')}
        />
        
        {wallets.map((wallet) => (
          <WalletGridItem
            key={wallet.id}
            id={wallet.id!}
            name={wallet.name}
            balance={wallet.balance}
            currency={wallet.currency}
            icon={wallet.icon}
            color={wallet.color}
            isActive={activeWalletId === wallet.id}
            isManageMode={isManageMode}
            onClick={() => handleSelectWallet(wallet.id!)}
            onEdit={() => setEditingWallet(wallet)}
            onDelete={() => setDeletingWallet(wallet)}
          />
        ))}
      </div>

      {/* Edit Wallet Modal */}
      {editingWallet && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <header className={styles.modalHeader}>
              <h2>{t('wallet.edit_title')}</h2>
              <button onClick={() => setEditingWallet(null)} className={styles.closeButton}>✕</button>
            </header>
            <WalletForm 
              data={editingWallet} 
              onChange={setEditingWallet} 
            />
            <button 
              className={styles.saveButton}
              onClick={onUpdateWallet}
              disabled={isLoading || !editingWallet.name}
            >
              {isLoading ? t('common.loading') : t('wallet.save_changes')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingWallet && (
        <DeleteModal 
          isOpen={!!deletingWallet}
          walletName={deletingWallet.name}
          onClose={() => setDeletingWallet(null)}
          onConfirm={onDeleteWallet}
        />
      )}
    </main>
  );
}
