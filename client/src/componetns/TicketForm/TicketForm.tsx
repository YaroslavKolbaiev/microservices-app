'use client';
import { FormEvent, useState, useEffect, useContext } from 'react';
import { tailwindClasses } from '@/tailwind/reusableClasses';
import useRequest from '@/hooks/use-request';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { ProgressContext } from '@/Context/ProgressContext';
import Image from 'next/image';

const TicketForm = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { setProgress } = useContext(ProgressContext);
  const router = useRouter();

  const { doRequest, isLoading } = useRequest({
    // url: '/api/create-ticket',
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
    doRequest('/api/create-ticket');
  };

  useEffect(() => {
    setProgress(false);
  }, []);

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
            'Submit'
          )}
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default TicketForm;
