'use client';
import { ProgressContext } from '@/Context/ProgressContext';
import { Order } from '@/types/Order';
import { toastOptions } from '@/utils/toastOptions';
import { useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOrders = ({ data }: { data: Order[] | null }) => {
  const { setProgress } = useContext(ProgressContext);

  useEffect(() => {
    setProgress(false);
    if (!data) {
      toast.error('Internal Server Error', toastOptions);
    }
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold dark:text-white text-center mb-4">
        My Orders
      </h2>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 px-5">
        {data?.map(({ id, ticket, status }) => (
          <li key={id} className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-lg text-gray-900 truncate dark:text-white">
                  {ticket.title}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {status}
                </p>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {ticket.price} $
              </div>
            </div>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </>
  );
};

export default MyOrders;
