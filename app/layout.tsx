'use client'

import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';

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
      <body className={inter.className}>
        <UserProvider>
          {showNavbar && <Navbar />}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
