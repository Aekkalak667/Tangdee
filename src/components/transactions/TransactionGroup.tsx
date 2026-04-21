"use client";

import React from "react";
import styles from "./TransactionGroup.module.css";

interface TransactionGroupProps {
  dateLabel: string; // e.g., "Today", "20 Apr"
  totalIncome?: number;
  totalExpense?: number;
  children: React.ReactNode;
  variant?: "list" | "card";
}

const TransactionGroup: React.FC<TransactionGroupProps> = ({
  dateLabel,
  totalIncome,
  totalExpense,
  children,
  variant = "list",
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const containerClass = variant === "card" 
    ? `${styles.groupContainer} ${styles.cardStyle}` 
    : styles.groupContainer;

  return (
    <div className={containerClass}>
      <div className={styles.header}>
        <span className={styles.date}>{dateLabel}</span>
        <div className={styles.summary}>
          {totalIncome !== undefined && totalIncome > 0 && (
            <span className={`${styles.badge} ${styles.incomeBadge}`}>
              +{formatCurrency(totalIncome)}
            </span>
          )}
          {totalExpense !== undefined && totalExpense > 0 && (
            <span className={`${styles.badge} ${styles.expenseBadge}`}>
              -{formatCurrency(totalExpense)}
            </span>
          )}
        </div>
      </div>
      <div className={styles.itemsContainer}>
        {children}
      </div>
    </div>
  );
};

export default TransactionGroup;
