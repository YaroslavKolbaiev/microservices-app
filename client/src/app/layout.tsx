import { ProgressProvider } from '@/Context/ProgressContext';
import './globals.css';
import { Nav } from '@/componetns';
import React from 'react';
// import { cookies } from 'next/headers';
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

// const getUser = async () => {
//   const cookieStore = cookies();

//   const token = cookieStore.get('token');
//   const res = await fetch('http://localhost:3000/api/users/current-user/', {
//     credentials: 'include',
//     headers: { cookie: token?.value } as HeadersInit,
//   });

//   const { currentUser } = await res.json();

//   return { currentUser };
// };

export default async function RootLayout({ children }: Props) {
  // const { currentUser } = await getUser();

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
