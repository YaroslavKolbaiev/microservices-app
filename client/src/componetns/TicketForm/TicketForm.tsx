'use client';
import { FormEvent, useState } from 'react';
import { tailwindClasses } from '@/tailwind/reusableClasses';
import useRequest from '@/hooks/use-request';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();

  const { doRequest, isLoading } = useRequest({
    url: '/api/create-ticket',
    method: 'POST',
    body: {
      title,
      price,
    },
    onSuccess: () => router.push('/'),
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    // round number to 2 chars after decimal
    setPrice(value.toFixed(2));
  };

  const onCreateTicket = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <>
      <form onSubmit={onCreateTicket}>
        <div className="mb-6">
          <label htmlFor="title" className={tailwindClasses.label}>
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            className={tailwindClasses.input}
            placeholder="name of Your ticket"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="price" className={tailwindClasses.label}>
            Price
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
            type="text"
            id="price"
            className={tailwindClasses.input}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`text-white
            bg-blue-700 
            hover:bg-blue-800 
            focus:ring-4 
            focus:outline-none 
            focus:ring-blue-300 
            font-medium 
            rounded-lg 
            text-sm 
            w-full 
            sm:w-auto 
            px-5 
            py-2.5 
            text-center 
            dark:bg-blue-600 
            dark:hover:bg-blue-700 
            dark:focus:ring-blue-800
            ${isLoading && 'cursor-not-allowed'}
          `}
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default TicketForm;
