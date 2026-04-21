import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './MenuSection.module.css';

interface MenuSectionProps {
  children: React.ReactNode;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ children }) => {
  return <div className={styles.section}>{children}</div>;
};

interface MenuRowProps {
  icon?: React.ReactNode;
  label: string;
  secondaryInfo?: React.ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
}

export const MenuRow: React.FC<MenuRowProps> = ({ 
  icon, 
  label, 
  secondaryInfo, 
  onClick, 
  showChevron = true 
}) => {
  return (
    <div className={styles.row} onClick={onClick}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.label}>{label}</div>
      <div className={styles.right}>
        {secondaryInfo && <span style={{ fontSize: '0.875rem' }}>{secondaryInfo}</span>}
        {showChevron && <ChevronRight className={styles.chevron} size={20} />}
      </div>
    </div>
  );
};
