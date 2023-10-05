import { MyOrders } from '@/componetns';
import { Order } from '@/types/Order';
import { getData } from '@/utils/wait';
import { cookies } from 'next/headers';

async function getOrders() {
  const cookieStore = cookies();

  const token = cookieStore.get('token');

  const res = await fetch(`http://localhost:3003/api/orders/`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      cookie: `${token?.value}`,
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
}

export default async function Orders() {
  // { data }: { data: Order[] | null }
  const { data }: { data: Order[] | null } = await getOrders();

  return (
    <section className="max-w-md mx-auto mt-20">
      <MyOrders data={data} />
    </section>
  );
}
