'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ArrowLeftRight, PlusCircle, Wallet, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      label: t('nav.home'),
      icon: Home,
      href: '/dashboard',
    },
    {
      label: t('nav.transactions'),
      icon: ArrowLeftRight,
      href: '/transactions',
    },
    {
      label: t('nav.add'),
      icon: PlusCircle,
      href: '/add',
      isAction: true,
    },
    {
      label: t('nav.wallet'),
      icon: Wallet,
      href: '/wallet',
    },
    {
      label: t('nav.settings'),
      icon: Settings,
      href: '/settings',
    },
  ];

  return (
    <nav className={styles.navContainer}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${
              item.isAction ? styles.addButton : ''
            }`}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
