'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/use-request';
import { UserContext } from '@/Context/UserContext';

export default function SignOut() {
  const router = useRouter();

  const { setUser } = useContext(UserContext);

  const { doRequest } = useRequest({
    method: 'POST',
    body: {},
    onSuccess: () => {
      setUser(null);
      router.push('/');
    },
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
