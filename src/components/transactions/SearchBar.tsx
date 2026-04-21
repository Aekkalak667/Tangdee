'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t('common.search_placeholder')}
          className={styles.input}
        />
        {value && (
          <button 
            className={styles.clearButton}
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
