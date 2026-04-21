"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/constants/categories";
import styles from "./TransactionItem.module.css";

interface TransactionItemProps {
  name: string;
  category: string; // The ID of the category
  amount: number;
  type: "income" | "expense" | "transfer";
  time?: string;
  showSeparator?: boolean;
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  category,
  amount,
  type,
  time,
  showSeparator = true,
  onClick,
}) => {
  const { t } = useLanguage();
  
  // Find category data from central library
  const categoryData = categories.find(c => c.id === category);
  const iconName = categoryData?.iconName || (type === 'transfer' ? 'ArrowLeftRight' : 'CircleDollarSign');
  const categoryLabel = categoryData ? t(`dashboard.categories.${categoryData.labelKey}`) : category;

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

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
            <span>{categoryLabel}</span>
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
