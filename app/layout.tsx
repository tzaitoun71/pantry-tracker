'use client';

import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/login';

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P74S6R8LE6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-P74S6R8LE6', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <UserProvider>
          {showNavbar && <Navbar />}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
