'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import ProfileHeader from '@/components/settings/ProfileHeader';
import { MenuSection, MenuRow } from '@/components/settings/MenuSection';
import LanguageSelection from '@/components/settings/LanguageSelection';
import { Globe, Info, LogOut, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const [view, setView] = useState<'main' | 'language'>('main');
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (view === 'language') {
    return (
      <main style={{ padding: '2rem', paddingBottom: '6rem', maxWidth: '600px', margin: '0 auto' }}>
        <LanguageSelection onBack={() => setView('main')} />
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', paddingBottom: '6rem', maxWidth: '600px', margin: '0 auto' }}>
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
            onClick={() => {}}
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
    </main>
  );
}
