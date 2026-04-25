'use client';

import React, { useState, useEffect, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Plus } from 'lucide-react';
import { categories as staticCategories, CATEGORY_GROUPS, Category } from '@/constants/categories';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { subscribeToCustomCategories, CustomCategory } from '@/services/categoryService';
import AddCategorySheet from './AddCategorySheet';
import styles from './CategoryGrid.module.css';

interface CategoryGridProps {
  activeCategoryId?: string;
  onSelect: (categoryId: string) => void;
  type: 'expense' | 'income';
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ activeCategoryId, onSelect, type }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToCustomCategories(user.uid, (data) => {
      setCustomCategories(data);
    });
    return () => unsubscribe();
  }, [user]);

  const allCategories = useMemo(() => {
    return [...staticCategories, ...customCategories];
  }, [customCategories]);

  const filteredCategories = allCategories.filter(c => c.type === type);
  const groups = Array.from(new Set(filteredCategories.map(c => c.group)));
  const [activeGroup, setActiveGroup] = useState(groups[0]);

  // Sync active group when type changes
  useEffect(() => {
    if (!groups.includes(activeGroup)) {
      setActiveGroup(groups[0]);
    }
  }, [type, groups, activeGroup]);

  const visibleCategories = filteredCategories.filter(c => c.group === activeGroup);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {groups.map(group => (
          <button
            key={group}
            type="button"
            className={`${styles.tab} ${activeGroup === group ? styles.activeTab : ''}`}
            onClick={() => setActiveGroup(group)}
          >
            {t(`dashboard.groups.${group}`)}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {visibleCategories.map(category => {
          const Icon = (LucideIcons as any)[category.iconName] || LucideIcons.HelpCircle;
          const label = category.isCustom 
            ? category.name 
            : t(`dashboard.categories.${category.labelKey}`);

          return (
            <div
              key={category.id}
              className={`${styles.item} ${activeCategoryId === category.id ? styles.selected : ''}`}
              onClick={() => onSelect(category.id)}
            >
              <div className={styles.iconCircle}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <span className={styles.label}>{label}</span>
            </div>
          );
        })}

        {/* Add Category Button */}
        <div 
          className={`${styles.item} ${styles.addItem}`}
          onClick={() => setIsAddSheetOpen(true)}
        >
          <div className={styles.iconCircle}>
            <Plus size={24} strokeWidth={1.5} />
          </div>
          <span className={styles.label}>{t('common.manage')}</span>
        </div>
      </div>

      {user && (
        <AddCategorySheet 
          isOpen={isAddSheetOpen}
          onClose={() => setIsAddSheetOpen(false)}
          uid={user.uid}
          type={type}
          onSuccess={(id) => {
            setActiveGroup(CATEGORY_GROUPS.CUSTOM);
            onSelect(id);
          }}
        />
      )}
    </div>
  );
};

export default CategoryGrid;
