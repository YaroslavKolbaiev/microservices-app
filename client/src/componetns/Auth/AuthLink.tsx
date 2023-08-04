'use client';

import Link from 'next/link';

const AuthLink = ({ page }: { page: string }) => {
  const isSignUpPage = page === 'sign-up';
  return (
    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
      {isSignUpPage ? 'Already' : "Don't"} have an account?{' '}
      <Link
        href={isSignUpPage ? 'sign-in' : 'sign-up'}
        className="font-medium text-sky-600 hover:underline dark:text-sky-500"
      >
        {isSignUpPage ? 'Login here' : 'Sign-Up here'}
      </Link>
    </p>
  );
};

export default AuthLink;
