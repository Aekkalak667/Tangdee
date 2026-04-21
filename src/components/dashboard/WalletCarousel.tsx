import React from 'react';
import CardPreview from '@/components/wallet/CardPreview';
import styles from './WalletCarousel.module.css';

interface Wallet {
  id: string;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

interface WalletCarouselProps {
  wallets: Wallet[];
}

const WalletCarousel: React.FC<WalletCarouselProps> = ({ wallets }) => {
  return (
    <div className={styles.carousel}>
      {wallets.map((wallet) => (
        <div key={wallet.id} className={styles.item}>
          <CardPreview
            name={wallet.name}
            balance={wallet.balance}
            currency={wallet.currency}
            icon={wallet.icon}
            color={wallet.color}
          />
        </div>
      ))}
    </div>
  );
};

export default WalletCarousel;
