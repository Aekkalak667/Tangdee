"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MonthlySummary } from "@/services/transactionService";
import styles from "./MiniCalendar.module.css";

interface MiniCalendarProps {
  summary: MonthlySummary;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ summary, selectedDate, onDateSelect }) => {
  const { t, language } = useLanguage();
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const dayLabels = [
    t('dashboard.days.sun'),
    t('dashboard.days.mon'),
    t('dashboard.days.tue'),
    t('dashboard.days.wed'),
    t('dashboard.days.thu'),
    t('dashboard.days.fri'),
    t('dashboard.days.sat'),
  ];

  const monthName = new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-US', {
    month: 'long',
    year: 'numeric',
  }).format(today);

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.empty} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isSelected = dateStr === selectedDate;
      const dayData = summary[dateStr];
      
      let indicatorClass = "";
      if (dayData) {
        const net = dayData.totalIncome - dayData.totalExpense;
        indicatorClass = net >= 0 ? styles.positive : styles.negative;
      }

      days.push(
        <div
          key={day}
          className={`${styles.dayCell} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
          onClick={() => onDateSelect(dateStr)}
        >
          {day}
          {dayData && <div className={`${styles.indicator} ${indicatorClass}`} />}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.monthName}>{monthName}</h3>
      </div>
      <div className={styles.grid}>
        {dayLabels.map((label, index) => (
          <div key={index} className={styles.dayLabel}>
            {label}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default MiniCalendar;
