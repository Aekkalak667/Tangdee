"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { categories as staticCategories } from "@/constants/categories";
import styles from "./TransactionItem.module.css";

interface TransactionItemProps {
  name: string;
  category: string; // The ID of the category
  iconName?: string; // Optional icon name from transaction record
  amount: number;
  type: "income" | "expense" | "transfer";
  time?: string;
  note?: string; // Optional note
  showSeparator?: boolean;
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  name,
  category,
  iconName: txIconName,
  amount,
  type,
  time,
  note,
  showSeparator = true,
  onClick,
}) => {
  const { t } = useLanguage();
  
  // Find category data from central library
  const categoryData = staticCategories.find(c => c.id === category);
  
  // Determine icon: Transaction Record Icon > Static Category Icon > Fallback
  const iconName = txIconName || categoryData?.iconName || (type === 'transfer' ? 'ArrowLeftRight' : 'CircleDollarSign');
  
  // Determine category label: Static Category Label > Fallback to name prop (readable name)
  const categoryLabel = categoryData ? t(`dashboard.categories.${categoryData.labelKey}`) : name;

  // Logic to handle Title and Subtitle to avoid redundancy and show notes
  const displayTitle = note || categoryLabel;
  const showCategoryInSub = !!(note && note !== categoryLabel);

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
          <span className={styles.name}>{displayTitle}</span>
          <div className={styles.details}>
            {showCategoryInSub && <span>{categoryLabel}</span>}
            {showCategoryInSub && time && <span>•</span>}
            {time && <span>{time}</span>}
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
