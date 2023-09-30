'use client';
import { useState, useEffect, useContext } from 'react';
import useRequest from '@/hooks/use-request';
import { Ticket } from '@/types/Ticket';
import LoadingState from './LoadingState';
import Head from './Head';
import Body from './Body';
import { ProgressContext } from '@/Context/UserContext';
import { ToastContainer } from 'react-toastify';

const TicketsBoard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const { setProgress } = useContext(ProgressContext);

  const { doRequest, isLoading } = useRequest({
    method: 'POST',
    body: {},
  });

  const fetchTickets = async () => {
    const tickets = await doRequest('/api/get-tickets');
    setTickets(tickets?.data);
  };

  useEffect(() => {
    setProgress(false);
    fetchTickets();
  }, []);

  return (
    <>
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
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </>
  );
};

export default TicketsBoard;
