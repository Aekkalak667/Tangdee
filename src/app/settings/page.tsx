'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import ProfileHeader from '@/components/settings/ProfileHeader';
import { MenuSection, MenuRow } from '@/components/settings/MenuSection';
import LanguageSelection from '@/components/settings/LanguageSelection';
import { Globe, Info, LogOut, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [view, setView] = useState<'main' | 'language'>('main');
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  return (
    <main style={{ padding: '2rem', paddingBottom: '8rem', maxWidth: '600px', margin: '0 auto', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {view === 'language' ? (
          <motion.div 
            key="language"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={containerVariants.transition}
          >
            <LanguageSelection onBack={() => setView('main')} />
          </motion.div>
        ) : (
          <motion.div 
            key="main"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={containerVariants.transition}
          >
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
              {t('nav.settings')}
            </h1>

            <ProfileHeader 
              name={user?.displayName || ''} 
              email={user?.email || ''} 
              avatarUrl={user?.photoURL || ''} 
            />

            <div style={{ marginTop: '2rem' }}>
              <MenuSection>
                <MenuRow 
                  icon={<Globe size={20} color="var(--gray-600)" />}
                  label={t('settings.language')}
                  secondaryInfo={t('settings.language_name')}
                  onClick={() => setView('language')}
                />
                <MenuRow 
                  icon={<Info size={20} color="var(--gray-600)" />}
                  label={t('settings.about')}
                  onClick={() => router.push('/about')}
                />
                <MenuRow 
                  icon={<ShieldCheck size={20} color="var(--gray-600)" />}
                  label={t('settings.version')}
                  secondaryInfo="v1.0.0"
                  showChevron={false}
                />
              </MenuSection>

              <div style={{ marginTop: '1.5rem' }}>
                <MenuSection>
                  <MenuRow 
                    icon={<LogOut size={20} color="#ef4444" />}
                    label={t('auth.logout')}
                    onClick={logout}
                    showChevron={false}
                  />
                </MenuSection>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
