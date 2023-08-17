'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authRequest } from '@/services/authRequest';

export default function SignOut() {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await authRequest(
        // change path when use kubernetes to just "/api/users/${path}"
        // it is possible when request is sent from browser(means client)
        `/api/users/sign-out`,
        'POST'
      );
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    signOut();
  }, []);

  return (
    <section className="max-w-md mx-auto mt-20">
      <div className="flex justify-center items-center">
        <img className="w-20" src="/180-ring.svg" alt="loader" />
      </div>
    </section>
  );
}
