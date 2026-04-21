import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { WalletProvider } from "@/context/WalletContext";
import NavigationWrapper from "@/components/navigation/NavigationWrapper";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-prompt",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ตังค์ดี - Tang Dee",
  description: "Personal Finance Management with Simplicity",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ตังค์ดี",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={prompt.variable}>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <WalletProvider>
              <NavigationWrapper>
                {children}
              </NavigationWrapper>
            </WalletProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
