"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useWallet } from "@/context/WalletContext";
import { subscribeToWallets, WalletData } from "@/services/walletService";
import WalletGridItem from "@/components/wallet/WalletGridItem";
import styles from "./WalletPage.module.css";

export default function WalletPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { activeWalletId, setActiveWallet } = useWallet();
  const router = useRouter();
  
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

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
    setActiveWallet(id);
    router.push('/dashboard');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('nav.wallet')}</h1>
        <button 
          className={styles.addButton}
          onClick={handleAddWallet}
          aria-label={t('wallet.add_wallet')}
        >
          <Plus size={24} />
        </button>
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
            onClick={() => handleSelectWallet(wallet.id!)}
          />
        ))}
      </div>
    </main>
  );
}
