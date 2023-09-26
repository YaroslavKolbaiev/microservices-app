'use client';
import Link from 'next/link';
import { CurrentUser } from '@/types/User';

const Nav = ({ currentUser }: { currentUser: CurrentUser }) => {
  return (
    <nav className="bg-slate-700 h-24 px-8">
      <div className="float-left flex h-full items-center">
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
      {currentUser ? (
        <div className="float-right flex h-full items-center gap-4">
          <Link
            className="float-right h-full flex items-center"
            href="/tickets/new"
          >
            <span
              className="text-white
            text-lg
            cursor-pointer
            hover:underline
            transition
            duration-200
          "
            >
              Create Ticket
            </span>
          </Link>
          <span className="text-white">Welcome {currentUser.email}</span>
          <Link
            href="/sign-out"
            className="border 
              border-slate-500 
              rounded-lg 
              p-2 
              bg-orange-300 
              hover:bg-orange-200
              transition
              duration-200
            "
          >
            Log Out
          </Link>
        </div>
      ) : (
        <Link className="float-right h-full flex items-center" href="/sign-in">
          <span
            className="text-white
            text-lg
            cursor-pointer
            hover:underline
            transition
            duration-200
          "
          >
            Login
          </span>
        </Link>
      )}
    </nav>
  );
};

export default Nav;
