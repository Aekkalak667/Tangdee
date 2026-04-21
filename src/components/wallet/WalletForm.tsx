import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Wallet, 
  CreditCard, 
  Landmark, 
  Banknote, 
  Coins, 
  Gem,
  LucideIcon,
  ChevronDown
} from 'lucide-react';
import styles from './WalletForm.module.css';

export interface WalletData {
  name: string;
  balance: number;
  currency: string;
  type: string;
  icon: string;
  color: string;
}

interface WalletFormProps {
  data: WalletData;
  onChange: (data: WalletData) => void;
}

export const WALLET_ICONS: Record<string, LucideIcon> = {
  Wallet,
  CreditCard,
  Landmark,
  Banknote,
  Coins,
  Gem,
};

const ICONS_KEYS = Object.keys(WALLET_ICONS);
const COLORS = [
  '#171717', // Black
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
];

interface CustomSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.customSelectContainer} ref={containerRef}>
        <div 
          className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerActive : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption?.label || value}</span>
          <ChevronDown size={18} className={isOpen ? styles.rotateIcon : ''} />
        </div>
        
        {isOpen && (
          <ul className={styles.optionsList}>
            {options.map((option) => (
              <li 
                key={option.value}
                className={`${styles.option} ${value === option.value ? styles.optionSelected : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const WalletForm: React.FC<WalletFormProps> = ({ data, onChange }) => {
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSelect = (field: keyof WalletData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const currencyOptions = [
    { label: 'THB (฿)', value: 'THB' },
    { label: 'USD ($)', value: 'USD' },
    { label: 'EUR (€)', value: 'EUR' },
    { label: 'JPY (¥)', value: 'JPY' },
  ];

  const typeOptions = [
    { label: t('wallet.types.cash'), value: 'cash' },
    { label: t('wallet.types.bank'), value: 'bank' },
    { label: t('wallet.types.card'), value: 'card' },
    { label: t('wallet.types.savings'), value: 'savings' },
    { label: t('wallet.types.investment'), value: 'investment' },
    { label: t('wallet.types.digital'), value: 'digital' },
    { label: t('wallet.types.other'), value: 'other' },
  ];

  return (
    <div className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>{t('wallet.name_label')}</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder={t('wallet.placeholder_name')}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>{t('wallet.balance_label')}</label>
        <input
          type="number"
          name="balance"
          value={data.balance}
          onChange={handleChange}
          placeholder="0.00"
          className={styles.input}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <CustomSelect 
          label={t('wallet.currency_label')}
          value={data.currency}
          options={currencyOptions}
          onChange={(val) => handleSelect('currency', val)}
        />

        <CustomSelect 
          label={t('wallet.type_label')}
          value={data.type}
          options={typeOptions}
          onChange={(val) => handleSelect('type', val)}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>{t('wallet.icon_label')}</label>
        <div className={styles.grid}>
          {ICONS_KEYS.map((key) => {
            const IconComponent = WALLET_ICONS[key];
            return (
              <button
                key={key}
                type="button"
                className={`${styles.iconButton} ${data.icon === key ? styles.active : ''}`}
                onClick={() => handleSelect('icon', key)}
              >
                <IconComponent size={20} />
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>{t('wallet.color_label')}</label>
        <div className={styles.grid}>
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.colorButton} ${data.color === color ? styles.active : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleSelect('color', color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletForm;
