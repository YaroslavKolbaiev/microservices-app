import { AuthForm } from '@/componetns';
import { isAuth } from '@/utils/isAuth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const token = cookies().get('token');

  const isAuthenticated = await isAuth(`${token?.value}`);

  if (isAuthenticated) {
    redirect('/');
  }
  return (
    <section className="max-w-md mx-auto mt-20">
      <AuthForm />
    </section>
  );
}
