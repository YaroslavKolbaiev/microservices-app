import { ProgressProvider } from '@/Context/ProgressContext';
import './globals.css';
import { Nav } from '@/componetns';
import React from 'react';
import { UserProvider } from '@/Context/UserContext';

export const metadata = {
  title: 'Best Ticket',
  description: 'Buy and Sell tickets',
  icons: {
    icon: '/favicon.ico',
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" className="scroll-smooth h-screen dark:bg-slate-800">
      <head />
      <body>
        <UserProvider>
          <ProgressProvider>
            <Nav />
            {children}
          </ProgressProvider>
        </UserProvider>
      </body>
    </html>
  );
}
