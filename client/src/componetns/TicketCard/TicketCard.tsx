'use client';
import useRequest from '@/hooks/use-request';
import { Order } from '@/types/Order';
import { Ticket } from '@/types/Ticket';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const router = useRouter();

  const { doRequest, isLoading } = useRequest({
    url: '/api/create-order',
    method: 'POST',
    body: { ticketId: ticket.id },
    onSuccess: (data: Order) => router.push(`/orders/${data.id}`),
  });

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
            onClick={doRequest}
            type="button"
            className={`text-white 
              w-full
              bg-blue-700 
              hover:bg-blue-800 
              focus:ring-4 
              focus:outline-none 
              focus:ring-blue-300 
              font-medium 
              rounded-lg 
              text-sm 
              px-5 
              py-2.5 
              text-center 
              dark:bg-blue-600 
              dark:hover:bg-blue-700 
              dark:focus:ring-blue-800
              ${isLoading && 'cursor-not-allowed'}
            `}
          >
            Buy
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TicketCard;
