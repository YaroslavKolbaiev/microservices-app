'use client';

import { toastOptions } from '@/utils/toastOptions';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthButton, AuthInput, AuthLink, TermsAndConditions } from '..';
import useRequest from '@/hooks/use-request';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const path = usePathname()?.slice(1);
  const router = useRouter();
  const isSignUpPage = path === 'sign-up';
  const isSignInPage = path === 'sign-in';
  // IMPORTANT !!! FOR AUTHORIZATION REQUEST MUST BE SENT FROM CLIENT
  // IN ORDER TO SET COOKIES.
  // ****** CHANGE PATH TO JUST /api/users/${path} WHIT KUBERNETES
  const { doRequest, isLoading } = useRequest({
    url: `http://localhost:3000/api/users/${path}`,
    method: 'POST',
    body: {
      email,
      password,
    },
    onSuccess: (data) => console.log(data),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUpPage && password !== passwordConfirm) {
      toast.error('password and confirm password must be equal.', toastOptions);
      return;
    }

    const res = await doRequest();

    if (res) {
      router.push('/');
    }
  };

  return (
    <>
      <div
        className="bg-white
          rounded-lg 
          shadow-md
          dark:border 
          md:mt-0 
          w-full
          xl:p-0 
          dark:bg-gray-800 
          dark:border-gray-700
        "
      >
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            className="text-xl 
              font-bold 
              leading-tight 
              tracking-tight 
              text-gray-900 
              md:text-2xl 
              dark:text-white
            "
          >
            {isSignUpPage && 'Create an Account'}
            {isSignInPage && 'Sign In'}
          </h1>
          <form
            onSubmit={onSubmit}
            className="space-y-4 md:space-y-6"
            action="#"
          >
            <AuthInput type="email" value={email} callback={setEmail} />
            <AuthInput
              type="password"
              value={password}
              callback={setPassword}
            />
            {isSignUpPage && (
              <AuthInput
                type="confirm-password"
                value={passwordConfirm}
                callback={setPasswordConfirm}
              />
            )}
            {isSignUpPage && <TermsAndConditions />}
            <AuthButton
              isLoading={isLoading}
              isSignUpPage={isSignUpPage}
              isSignInPage={isSignInPage}
            />
            {isSignUpPage && <AuthLink page="sign-up" />}
            {isSignInPage && <AuthLink page="sign-in" />}
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AuthForm;
