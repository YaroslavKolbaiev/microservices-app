import { TicketsBoard } from '@/componetns';
import Pagination from '@/componetns/Pagination/Pagination';
import { Ticket } from '@/types/Ticket';

const getTickets = async (skip: number, limit: number) => {
  const res = await fetch(
    'http://application-srv.default.svc.cluster.local:3000/api-service/application/get-tickets',
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ skip: skip || 0, limit }),
      credentials: 'include',
      cache: 'no-store'
    }
  );

  const data = await res?.json();

  if (!res.ok) {
    const errorMessage = data.errors[0].message;
    throw new Error(errorMessage);
  }

  return { data };
};

interface FetchProps {
  data: { tickets: Ticket[]; ticketsCount: number };
}

interface Props {
  searchParams: { page: string };
}

export default async function Home({ searchParams }: Props) {
  const JOBS_PER_PAGE = 10;
  const skip = (+searchParams.page - 1) * JOBS_PER_PAGE;

  const { data }: FetchProps = await getTickets(skip, JOBS_PER_PAGE);

  return (
    <div className="max-w-7xl px-5 mx-auto">
      <TicketsBoard tickets={data.tickets} />
      {data.ticketsCount > JOBS_PER_PAGE && (
        <Pagination
          totalItems={data.ticketsCount}
          jobsPerPage={JOBS_PER_PAGE}
        />
      )}
    </div>
  );
}
