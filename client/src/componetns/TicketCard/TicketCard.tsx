'use client';
import { useEffect, useContext } from 'react';
import useRequest from '@/hooks/use-request';
import { tailwindClasses } from '@/tailwind/reusableClasses';
import { Order } from '@/types/Order';
import { Ticket } from '@/types/Ticket';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { ProgressContext } from '@/Context/ProgressContext';
import Image from 'next/image';

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const router = useRouter();
  const { setProgress } = useContext(ProgressContext);

  const { doRequest, isLoading } = useRequest({
    method: 'POST',
    body: { ticketId: ticket.id },
    onSuccess: (data: Order) => router.push(`/order/${data.id}`),
  });

  useEffect(() => {
    setProgress(false);
  }, []);

  return (
    <>
      <div
        className="w-full 
          max-w-sm
          border 
          border-gray-200 
          rounded-lg 
          shadow 
          dark:bg-gray-800 
          dark:border-gray-700
        "
      >
        <div className="p-6">
          <div>
            <h2
              className="text-4xl 
                text-center
                font-semibold 
                tracking-tight 
                text-gray-900 
                dark:text-white
              "
            >
              {ticket.title}
            </h2>
          </div>
          <hr className="my-2" />
          <p
            className="text-3xl 
              font-bold 
              text-gray-900 
              dark:text-white 
              py-6 
              text-center
            "
          >
            Price: ${ticket.price}
          </p>
          <button
            disabled={isLoading}
            onClick={() => {
              doRequest('/api/create-order');
            }}
            type="button"
            className={`${tailwindClasses.button}
              ${isLoading && 'cursor-not-allowed'}
            `}
          >
            {isLoading ? (
              <Image
                width={24}
                height={24}
                src="/pulse-rings-multiple.svg"
                alt="loader"
              />
            ) : (
              'Buy'
            )}
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TicketCard;
