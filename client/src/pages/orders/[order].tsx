import { OrderCard } from '@/componetns';
import { Order } from '@/types/Order';
import { CurrentUser } from '@/types/User';

const ShowOrder = ({
  data,
  currentUser,
}: {
  data: Order;
  currentUser: CurrentUser;
}) => {
  /** calculate exparation date of order */
  const expiration = new Date();
  /** set expiration period equals to 1min */
  expiration.setSeconds(expiration.getSeconds() + 10 * 60);
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

  // const expiration = new Date();
  // /** set expiration period equals to 1min */
  // expiration.setSeconds(expiration.getSeconds() + 5 * 60);

  // const data = {
  //   id: 'ID-1',
  //   status: 'created',
  //   userId: '64b72fd84e1c6af7eadf0898',
  //   expiresAt: expiration.toISOString(),
  //   ticket: {
  //     id: 'ID-2',
  //     price: 200,
  //     title: 'BOXING NIGHT',
  //   },
  // };

  return { props: { data } };
};

export default ShowOrder;
