'use client';

import React from 'react';
import { Delete } from 'lucide-react';
import styles from './TransactionKeypad.module.css';

interface TransactionKeypadProps {
  onKeyPress: (key: string) => void;
}

const TransactionKeypad: React.FC<TransactionKeypadProps> = ({ onKeyPress }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <div className={styles.grid}>
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          className={styles.key}
          onClick={() => onKeyPress(key)}
          aria-label={key === 'backspace' ? 'Delete' : key}
        >
          {key === 'backspace' ? <Delete size={24} /> : key}
        </button>
      ))}
    </div>
  );
};

export default TransactionKeypad;
