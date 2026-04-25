'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/constants/categories';
import { Transaction } from '@/services/transactionService';
import styles from './TransactionActionSheet.module.css';

interface TransactionActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  transaction: Transaction | null;
}

const TransactionActionSheet: React.FC<TransactionActionSheetProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  transaction,
}) => {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!transaction) return null;

  // Find category data
  const categoryData = categories.find((c) => c.id === transaction.categoryId);
  const iconName = transaction.iconName || categoryData?.iconName || (transaction.type === 'transfer' ? 'ArrowLeftRight' : 'CircleDollarSign');
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  const formattedAmount = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    signDisplay: 'always',
  }).format(transaction.type === 'expense' ? -transaction.amount : transaction.amount);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.container}>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className={styles.sheet}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.iconContainer}>
                <IconComponent size={32} strokeWidth={2.5} />
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{transaction.note || transaction.name}</span>
                {transaction.note && (
                  <span className={styles.categorySub}>{transaction.name}</span>
                )}
                <span className={`${styles.amount} ${styles[transaction.type]}`}>
                  {formattedAmount}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => {
                  onEdit(transaction);
                  onClose();
                }}
              >
                <Pencil size={20} />
                {t('transactions.edit_transaction')}
              </button>

              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => {
                  onDelete(transaction);
                  onClose();
                }}
              >
                <Trash2 size={20} />
                {t('transactions.delete_transaction')}
              </button>

              <button className={`${styles.actionButton} ${styles.cancelButton}`} onClick={onClose}>
                {t('wallet.cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
};

export default TransactionActionSheet;
