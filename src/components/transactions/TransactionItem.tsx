"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import styles from "./TransactionItem.module.css";

interface TransactionItemProps {
  name: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  time?: string;
  iconName?: string;
  showSeparator?: boolean;
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  category,
  amount,
  type,
  time,
  iconName = "CircleDollarSign",
  showSeparator = true,
  onClick,
}) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.CircleDollarSign;

  const formattedAmount = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    signDisplay: "always",
  }).format(type === "expense" ? -amount : amount);

  return (
    <>
      <div className={styles.item} onClick={onClick}>
        <div className={styles.iconContainer}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>
        
        <div className={styles.content}>
          <span className={styles.name}>{name}</span>
          <div className={styles.details}>
            <span>{category}</span>
            {time && (
              <>
                <span>•</span>
                <span>{time}</span>
              </>
            )}
          </div>
        </div>

        <div className={styles.amountContainer}>
          <span className={`${styles.amount} ${type === "income" ? styles.income : styles.expense}`}>
            {formattedAmount}
          </span>
        </div>
      </div>
      {showSeparator && <div className={styles.separator} />}
    </>
  );
};

export default TransactionItem;
