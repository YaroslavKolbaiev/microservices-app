import { toastOptions } from '@/utils/toastOptions';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DoRequest {
  method: string;
  body: any;
  onSuccess?: (data: any) => void;
}

export default ({ method, body, onSuccess }: DoRequest) => {
  const [isLoading, setIsLoading] = useState(false);

  const doRequest = async (url: string) => {
    setIsLoading(true);
    let response;

    if (method === 'GET') {
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }

    if (method === 'POST') {
      response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });
    }

    const data = await response?.json();

    if (onSuccess && response?.ok) {
      onSuccess(data);
    }

    if (!response?.ok) {
      for (const index in data.errors) {
        toast.error(data.errors[index].message, toastOptions);
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

    return { data, response };
  };

  return { doRequest, isLoading };
};
