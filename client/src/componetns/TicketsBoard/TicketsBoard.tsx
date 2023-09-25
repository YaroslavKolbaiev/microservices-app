'use client';
import { useState, useEffect } from 'react';
import useRequest from '@/hooks/use-request';
import { Ticket } from '@/types/Ticket';
import LoadingState from './LoadingState';
import Head from './Head';
import Body from './Body';

const TicketsBoard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [progress, setProgress] = useState(false);

  const { doRequest, isLoading } = useRequest({
    url: '/api/get-tickets',
    method: 'POST',
    body: {},
  });

  const fetchTickets = async () => {
    const tickets = await doRequest();
    setTickets(tickets?.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      {progress && <span className="loader absolute top-24 left-0" />}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <Head />
          <tbody>
            {isLoading ? (
              <LoadingState />
            ) : (
              tickets?.map(({ title, price, id }, i) => {
                return (
                  <Body
                    key={id}
                    title={title}
                    price={price}
                    index={i}
                    id={id}
                    setProgress={setProgress}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TicketsBoard;
