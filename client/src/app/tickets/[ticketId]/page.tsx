import TicketCard from '@/componetns/TicketCard/TicketCard';
import { Ticket } from '@/types/Ticket';
import { getData } from '@/utils/wait';

const getTicket = async (ticketId: string) => {
  const res = await fetch(`http://localhost:3002/api/application/${ticketId}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    // This will activate the closest `error.tsx` Error Boundary
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
};

const ShowTicket = async ({ params }: { params: { ticketId: string } }) => {
  const { data }: { data: Ticket } = await getTicket(params.ticketId);

  return (
    <section className="flex justify-center pt-5">
      <TicketCard ticket={data} />
    </section>
  );
};

export default ShowTicket;
