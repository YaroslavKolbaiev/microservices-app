import { Nav } from '@/componetns';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Microservices App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
