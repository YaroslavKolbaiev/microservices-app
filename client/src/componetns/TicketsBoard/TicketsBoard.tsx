'use client';
import { useState, useEffect, useContext } from 'react';
import { Ticket } from '@/types/Ticket';
import Head from './Head';
import Body from './Body';
import { ProgressContext } from '@/Context/ProgressContext';

const TicketsBoard = ({ tickets }: { tickets: Ticket[] }) => {
  const { setProgress } = useContext(ProgressContext);

  useEffect(() => {
    setProgress(false);
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <Head />
        <tbody>
          {tickets?.map(({ title, price, id }, i) => {
            return (
              <Body key={id} title={title} price={price} index={i} id={id} />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsBoard;
