'use client';

import Image from 'next/image';

interface Props {
  isLoading: boolean;
  isSignUpPage: boolean;
  isSignInPage: boolean;
}

const AuthButton = ({ isLoading, isSignUpPage, isSignInPage }: Props) => {
  return (
    <button
      type="submit"
      className="w-full 
        text-white 
        bg-sky-600 
        hover:bg-sky-700 
        focus:ring-4 
        focus:outline-none 
        focus:ring-sky-300 
        font-medium 
        rounded-lg 
        px-5 
        py-2.5 
        text-center 
        dark:bg-sky-600 
        dark:hover:bg-sky-700 
        dark:focus:ring-sky-800
        flex
        justify-center
      "
    >
      {isLoading ? (
        <Image
          width={24}
          height={24}
          src="/pulse-rings-multiple.svg"
          alt="loader"
        />
      ) : (
        <p>
          {isSignUpPage && 'Create an Account'}
          {isSignInPage && 'Sign In'}
        </p>
      )}
    </button>
  );
};

export default AuthButton;
