'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Globe, Heart, Zap, Mail, User, ShieldCheck } from 'lucide-react';
import styles from './About.module.css';
import Image from 'next/image';

const AboutPage = () => {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={styles.title}>{t('settings.about_title')}</h1>
      </header>

      <main className={styles.content}>
        <section className={styles.profileSection}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/icon.png" 
              alt="Tang Dee Logo" 
              width={100} 
              height={100} 
              className={styles.logo}
            />
          </div>
          <h2 className={styles.appName}>{t('common.app_name')}</h2>
          <p className={styles.tagline}>Simplicity in every cent.</p>
        </section>

        <section className={styles.infoSection}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Zap size={20} className={styles.icon} />
              <h3>{t('settings.mission_title')}</h3>
            </div>
            <p>{t('settings.mission_desc')}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Heart size={20} className={styles.icon} />
              <h3>{t('settings.creator_title')}</h3>
            </div>
            <p>{t('settings.creator_desc')}</p>
          </div>
        </section>

        <section className={styles.socialSection}>
          <a href="#" className={styles.socialLink}><Globe size={24} /></a>
          <a href="#" className={styles.socialLink}><Mail size={24} /></a>
          <a href="#" className={styles.socialLink}><User size={24} /></a>
        </section>

        <footer className={styles.footer}>
          <p>{t('settings.version')} 1.0.0</p>
          <p className={styles.copyright}>© 2026 Tang Dee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;
