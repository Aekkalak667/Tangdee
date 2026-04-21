'use client';

import React from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MenuSection, MenuRow } from './MenuSection';
import styles from './MenuSection.module.css';

interface LanguageSelectionProps {
  onBack: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onBack }) => {
  const { language, setLanguage, t } = useLanguage();

  const options = [
    { label: 'ภาษาไทย', value: 'th' as const },
    { label: 'English', value: 'en' as const },
  ];

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--gray-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ArrowLeft size={20} color="var(--gray-600)" />
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
          {t('nav.settings')}
        </h2>
      </header>

      <MenuSection>
        {options.map((option) => (
          <MenuRow
            key={option.value}
            label={option.label}
            onClick={() => setLanguage(option.value)}
            showChevron={false}
            secondaryInfo={language === option.value ? <Check size={20} color="var(--foreground)" /> : undefined}
          />
        ))}
      </MenuSection>
      
      <p style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        fontSize: '0.875rem', 
        color: 'var(--gray-400)',
        lineHeight: '1.5',
        padding: '0 2rem'
      }}>
        {t('settings.language_info')}
      </p>
    </div>
  );
};

export default LanguageSelection;
