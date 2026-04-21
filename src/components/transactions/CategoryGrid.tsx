'use client';

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { categories, CATEGORY_GROUPS } from '@/constants/categories';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CategoryGrid.module.css';

interface CategoryGridProps {
  activeCategoryId?: string;
  onSelect: (categoryId: string) => void;
  type: 'expense' | 'income';
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ activeCategoryId, onSelect, type }) => {
  const { t } = useLanguage();
  const filteredCategories = categories.filter(c => c.type === type);
  const groups = Array.from(new Set(filteredCategories.map(c => c.group)));
  const [activeGroup, setActiveGroup] = useState(groups[0]);

  // Sync active group when type changes (e.g. from expense to income)
  useEffect(() => {
    setActiveGroup(groups[0]);
  }, [type]);

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
          return (
            <div
              key={category.id}
              className={`${styles.item} ${activeCategoryId === category.id ? styles.selected : ''}`}
              onClick={() => onSelect(category.id)}
            >
              <div className={styles.iconCircle}>
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <span className={styles.label}>{t(`dashboard.categories.${category.labelKey}`)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
