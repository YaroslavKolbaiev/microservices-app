import { OrderCard } from '@/componetns';
import { Order } from '@/types/Order';
import { getData } from '@/utils/wait';
import { cookies } from 'next/headers';

const getOrder = async (orderId: string) => {
  const cookieStore = cookies();

  const token = cookieStore.get('token');

  const res = await fetch(`http://localhost:3003/api/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      cookie: `${token?.value}`,
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    // This will activate the closest `error.tsx` Error Boundary
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
};

const ShowOrder = async ({ params }: { params: { orderId: string } }) => {
  const { data }: { data: Order } = await getOrder(params.orderId);

  return (
    <section className="flex justify-center pt-5">
      <OrderCard order={data} />
    </section>
  );
};

export default ShowOrder;
