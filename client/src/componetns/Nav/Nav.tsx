'use client';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { CurrentUser } from '@/types/User';
import NavLink from './NavLink';
import DropDown from './DropDown';
import { ProgressContext } from '@/Context/UserContext';

const Nav = ({ currentUser }: { currentUser: CurrentUser }) => {
  const { progress, setProgress } = useContext(ProgressContext);

  return (
    <nav className="bg-slate-700 h-24 px-8 flex items-center justify-between relative">
      <div className="flex h-full items-center">
        <Link href="/">
          <span
            className="text-white 
              text-lg 
              cursor-pointer 
              hover:text-blue-500 
              transition 
              duration-200
            "
          >
            MICROSERVICES
          </span>
        </Link>
      </div>
      {currentUser && (
        <h1 className="text-white text-xl font-bold hidden sm:block">
          Welcome {currentUser.email}
        </h1>
      )}
      {currentUser ? (
        <>
          <div className="hidden h-full items-center gap-4 md:flex text-slate-400">
            <NavLink path="/orders/" name="My Orders" />
            |
            <NavLink path="/tickets/new" name="Create Ticket" />
            |
            <NavLink path="/sign-out" name="Log Out" />
          </div>
          <DropDown />
        </>
      ) : (
        <NavLink path="/sign-in" name="Log In" />
      )}
      {progress && <span className="loader absolute bottom-0 left-0" />}
    </nav>
  );
};

export default Nav;
