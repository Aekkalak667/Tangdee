"use client";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', letterSpacing: '-0.025em' }}>{t('common.app_name')}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.displayName || 'User'}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{user?.email}</p>
          </div>
          <button 
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              backgroundColor: 'transparent',
              border: '1px solid var(--gray-200)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {t('auth.logout')}
          </button>
        </div>
      </header>

      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
          {t('home.welcome')}, {user?.displayName?.split(' ')[0] || 'User'}!
        </h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem', marginBottom: '3rem' }}>
          {t('home.subtitle')}
        </p>
        
        <Link 
          href="/create-wallet"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#171717',
            color: 'white',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            transition: 'transform 0.2s, opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {t('home.create_first_wallet')}
        </Link>
      </section>
    </main>
  );
}
