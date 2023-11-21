import { MyOrders } from '@/componetns';
import { Order } from '@/types/Order';
import { cookies } from 'next/headers';

async function getOrders() {
  const cookieStore = cookies();

  const token = cookieStore.get('token');

  const res = await fetch(
    'http://orders-srv.default.svc.cluster.local:3000/api-service/orders/',
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        cookie: `${token?.value}`,
      },
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
}

export default async function Orders() {
  const { data }: { data: Order[] | null } = await getOrders();

  return (
    <section className="max-w-md mx-auto mt-20">
      <MyOrders data={data} />
    </section>
  );
}
