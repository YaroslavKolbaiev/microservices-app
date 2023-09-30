import TicketCard from '@/componetns/TicketCard/TicketCard';
import { Ticket } from '@/types/Ticket';

const ShowTicket = ({ data }: { data: Ticket }) => {
  return (
    <section className="flex justify-center pt-5">
      <TicketCard ticket={data} />
    </section>
  );
};

export const getServerSideProps = async (context: any) => {
  const { ticket } = context.params;

  const res = await fetch(`http://localhost:3002/api/application/${ticket}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await res.json();

  return { props: { data } };
};

// ******** SHELL I USE STATICPROPS FOR THIS ROUTE ??? *****************
// export const getStaticPaths = async () => {
//   const res = await fetch('http://localhost:3002/api/application/');
//   const data: Ticket[] = await res.json();

//   // Get the paths we want to pre-render based on posts
//   const paths = data.map((ticket) => ({
//     params: { ticket: ticket.id },
//   }));
//   return {
//     paths,
//     fallback: true, // false or "blocking"
//   };
// };

export default ShowTicket;
