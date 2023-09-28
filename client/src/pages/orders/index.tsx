import { Order } from '@/types/Order';

export default function Orders({ data }: { data: Order[] }) {
  console.log(data);
  return (
    <section className="max-w-md mx-auto mt-20">
      <div className="text-white">MY ORDERS</div>
    </section>
  );
}

export const getServerSideProps = async (context: any) => {
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
};
