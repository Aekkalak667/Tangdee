"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const { t } = useLanguage();

  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      backgroundColor: "var(--background)",
      color: "var(--foreground)"
    }}>
      <LanguageSwitcher />
      <div style={{
        width: "100%",
        maxWidth: "460px",
        textAlign: "center",
        padding: "4rem 3rem",
        borderRadius: "2rem",
        backgroundColor: "var(--background)",
        border: "1px solid var(--gray-100)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.03)"
      }}>
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontSize: "2.25rem",
            fontWeight: "800",
            color: "var(--foreground)",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem"
          }}>
            {t('common.app_name')}
          </p>
          
          <h1 style={{
            fontSize: "1.25rem",
            fontWeight: "500",
            color: "var(--gray-600)",
            letterSpacing: "-0.01em",
            lineHeight: "1.4",
            marginBottom: "1rem",
            maxWidth: "280px",
            marginInline: "auto"
          }}>
            {t('auth.login_title')}
          </h1>
          <p style={{
            color: "var(--gray-400)",
            fontSize: "0.9375rem",
            fontWeight: "400",
            lineHeight: "1.6",
            maxWidth: "240px",
            marginInline: "auto"
          }}>
            {t('auth.login_subtitle')}
          </p>
        </div>
        
        <button
          onClick={loginWithGoogle}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "opacity 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          {t('auth.login_google')}
        </button>
      </div>
    </main>
  );
}
