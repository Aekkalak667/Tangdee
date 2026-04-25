'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import styles from './IconPicker.module.css';

// A curated list of Lucide icon names suitable for financial categories
export const CATEGORY_ICONS = [
  'Utensils', 'Coffee', 'CupSoda', 'Cake', 'Beer', 'ShoppingCart',
  'Car', 'Fuel', 'Bus', 'Train', 'Plane', 'ParkingCircle', 'Wrench',
  'Zap', 'Droplets', 'Globe', 'Phone', 'Home', 'Repeat',
  'ShoppingBag', 'Shirt', 'Sparkles', 'Film', 'Palette', 'Gamepad2', 'Gift', 'Trophy',
  'Stethoscope', 'Pill', 'Dumbbell', 'ShieldCheck',
  'Wallet', 'Briefcase', 'TrendingUp', 'Star', 'Percent', 'PlusCircle',
  'Heart', 'Smile', 'Music', 'Camera', 'Book', 'Monitor', 'Tv', 'Smartphone',
  'Sun', 'Moon', 'Cloud', 'Umbrella', 'Wind', 'Snowflake'
];

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  return (
    <div className={styles.grid}>
      {CATEGORY_ICONS.map((iconName) => {
        const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
        return (
          <div
            key={iconName}
            className={`${styles.iconItem} ${selectedIcon === iconName ? styles.active : ''}`}
            onClick={() => onSelect(iconName)}
            title={iconName}
          >
            <Icon size={20} strokeWidth={1.5} />
          </div>
        );
      })}
    </div>
  );
};

export default IconPicker;
