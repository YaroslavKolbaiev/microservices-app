import TicketCard from '@/componetns/TicketCard/TicketCard';
import { Ticket } from '@/types/Ticket';

const getTicket = async (ticketId: string) => {
  const res = await fetch(
    `http://application-srv.default.svc.cluster.local:3000/api-service/application/${ticketId}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
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
