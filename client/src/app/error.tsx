'use client'; // Error components must be Client Components

import { ProgressContext } from '@/Context/ProgressContext';
import ErrorInfo from '@/componetns/Error/ErrorInfo';
import { toastOptions } from '@/utils/toastOptions';
import { useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { setProgress } = useContext(ProgressContext);

  useEffect(() => {
    setProgress(false);

    console.log(error.message);

    toast.error(error.message, toastOptions);
  }, [error]);

  return (
    <>
      <div className="max-w-lg mt-10 px-5 mx-auto">
        <ErrorInfo reset={reset} />
      </div>
      <ToastContainer />
    </>
  );
}
