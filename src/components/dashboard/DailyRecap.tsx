"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MonthlySummary } from "@/services/transactionService";
import styles from "./DailyRecap.module.css";

interface DailyRecapProps {
  date: string;
  summary?: MonthlySummary[string];
}

const DailyRecap: React.FC<DailyRecapProps> = ({ date, summary }) => {
  const { t, language } = useLanguage();

  const formattedDate = new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

  const isToday = new Date(date).toDateString() === new Date().toDateString();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {isToday ? t('dashboard.today') : formattedDate}
      </h3>
      
      {summary ? (
        <div className={styles.grid}>
          <div className={styles.item}>
            <span className={styles.label}>{t('dashboard.income')}</span>
            <span className={`${styles.amount} ${styles.income}`}>
              +{summary.totalIncome.toLocaleString()}
            </span>
          </div>
          <div className={styles.item}>
            <span className={styles.label}>{t('dashboard.expense')}</span>
            <span className={`${styles.amount} ${styles.expense}`}>
              -{summary.totalExpense.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.noData}>
          {t('dashboard.no_data')}
        </div>
      )}
    </div>
  );
};

export default DailyRecap;
