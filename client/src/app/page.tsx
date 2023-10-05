import { TicketsBoard } from '@/componetns';
import { Ticket } from '@/types/Ticket';

const getTickets = async () => {
  const res = await fetch(`http://localhost:3002/api/application/`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
};

export default async function Home() {
  const { data }: { data: Ticket[] } = await getTickets();

  return (
    <div className="max-w-7xl px-5 mx-auto">
      <TicketsBoard tickets={data} />
    </div>
  );
}
