import { MyOrders } from '@/componetns';
import { Order } from '@/types/Order';

export default function Orders({ data }: { data: Order[] | null }) {
  return (
    <section className="max-w-md mx-auto mt-20">
      <MyOrders data={data} />
    </section>
  );
}

export const getServerSideProps = async (context: any) => {
  try {
    const res = await fetch(`http://localhost:3003/api/orders/`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        cookie: `${context.req.cookies.token}`,
      },
      credentials: 'include',
    });

    const data = await res.json();

    return { props: { data } };
  } catch (error) {
    return { props: { data: null } };
  }
};
