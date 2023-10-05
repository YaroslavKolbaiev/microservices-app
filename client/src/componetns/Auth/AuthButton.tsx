'use client';

import { tailwindClasses } from '@/tailwind/reusableClasses';
import Image from 'next/image';

interface Props {
  isLoading: boolean;
  isSignUpPage: boolean;
  isSignInPage: boolean;
}

const AuthButton = ({ isLoading, isSignUpPage, isSignInPage }: Props) => {
  return (
    <button type="submit" className={tailwindClasses.button}>
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
