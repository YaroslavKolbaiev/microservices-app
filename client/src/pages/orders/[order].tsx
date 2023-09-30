import { OrderCard } from '@/componetns';
import { Order } from '@/types/Order';
import { CurrentUser } from '@/types/User';

const ShowOrder = ({ data }: { data: Order }) => {
  return (
    <section className="flex justify-center pt-5">
      <OrderCard order={data} />
    </section>
  );
};

export const getServerSideProps = async (context: any) => {
  const { order } = context.params;

  const res = await fetch(`http://localhost:3003/api/orders/${order}`, {
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

export default ShowOrder;
