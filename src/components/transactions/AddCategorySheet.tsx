'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { addCustomCategory } from '@/services/categoryService';
import IconPicker from '../ui/IconPicker';
import styles from './AddCategorySheet.module.css';

interface AddCategorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  uid: string;
  type: 'expense' | 'income';
  onSuccess: (categoryId: string) => void;
}

const AddCategorySheet: React.FC<AddCategorySheetProps> = ({
  isOpen,
  onClose,
  uid,
  type,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('PlusCircle');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSave = async () => {
    if (!name || isLoading) return;

    setIsLoading(true);
    try {
      const categoryId = await addCustomCategory(uid, {
        name,
        type,
        iconName,
      });
      onSuccess(categoryId);
      setName('');
      setIconName('PlusCircle');
      onClose();
    } catch (error) {
      console.error('Error saving custom category:', error);
      alert(t('common.error_generic'));
    } finally {
      setIsLoading(false);
    }
  };

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
              <button className={styles.closeButton} onClick={onClose}>
                <X size={24} />
              </button>
              <h2 className={styles.title}>{t('dashboard.categories.add_custom')}</h2>
              <button 
                className={styles.doneButton} 
                onClick={handleSave}
                disabled={!name || isLoading}
              >
                {isLoading ? <div className={styles.spinner} /> : <Check size={24} />}
              </button>
            </div>

            <div className={styles.content}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t('dashboard.categories.name_label')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('dashboard.categories.name_placeholder')}
                  className={styles.input}
                  autoFocus
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>{t('dashboard.categories.select_icon')}</label>
                <IconPicker selectedIcon={iconName} onSelect={setIconName} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
};

export default AddCategorySheet;
