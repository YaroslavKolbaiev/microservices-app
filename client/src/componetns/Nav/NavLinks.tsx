import Link from 'next/link';

const NavLinks = () => {
  return (
    <div className="float-right flex h-full items-center justify-between gap-3">
      <Link href="/sign-up">
        <span
          className="text-white 
            text-lg 
            cursor-pointer 
            hover:underline 
            transition 
            duration-200
          "
        >
          Sign Up
        </span>
      </Link>
      <Link href="/sign-in">
        <span
          className="text-white 
            text-lg 
            cursor-pointer 
            hover:underline 
            transition 
            duration-200
          "
        >
          Sign In
        </span>
      </Link>
    </div>
  );
};

export default NavLinks;
