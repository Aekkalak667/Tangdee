import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './MenuSection.module.css';
import { motion } from 'framer-motion';

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
    <motion.div 
      className={styles.row} 
      onClick={onClick}
      whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.label}>{label}</div>
      <div className={styles.right}>
        {secondaryInfo && <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{secondaryInfo}</span>}
        {showChevron && <ChevronRight className={styles.chevron} size={20} />}
      </div>
    </motion.div>
  );
};
