'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteAll: boolean) => void;
  walletName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  walletName,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label={t('wallet.cancel')}>
          <X size={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.warningIcon}>
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>
          <h2 className={styles.title}>{t('wallet.delete_title')}</h2>
          <p className={styles.description}>
            {t('wallet.delete_description').replace('{name}', walletName)}
          </p>
        </div>

        <div className={styles.options}>
          <button 
            className={`${styles.optionButton} ${styles.dangerButton}`}
            onClick={() => onConfirm(true)}
          >
            <span className={styles.optionTitle}>{t('wallet.delete_all')}</span>
            <span className={styles.optionSubtitle}>{t('wallet.delete_all_subtitle')}</span>
          </button>

          <button 
            className={`${styles.optionButton} ${styles.secondaryButton}`}
            onClick={() => onConfirm(false)}
          >
            <span className={styles.optionTitle}>{t('wallet.delete_only')}</span>
            <span className={styles.optionSubtitle}>{t('wallet.delete_only_subtitle')}</span>
          </button>
        </div>

        <button className={styles.cancelButton} onClick={onClose}>
          {t('wallet.cancel')}
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
