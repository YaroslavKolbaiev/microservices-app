'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/use-request';

export default function SignOut() {
  const router = useRouter();

  const { doRequest } = useRequest({
    // url: `http://localhost:3000/api/users/${path}`,
    method: 'POST',
    body: {},
    onSuccess: () => router.push('/'),
  });

  useEffect(() => {
    doRequest('http://localhost:3000/api/users/sign-out');
  }, []);

  return (
    <section className="max-w-md mx-auto mt-20">
      <div className="flex justify-center items-center">
        <img className="w-20" src="/180-ring.svg" alt="loader" />
      </div>
    </section>
  );
}
