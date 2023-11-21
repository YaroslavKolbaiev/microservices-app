'use client';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PayNow, loadStripe } from 'react-stripe-js';
import 'react-stripe-js/dist/style.css';

interface StripeRes {
  clientSecret: string;
  id: string;
}

interface Props {
  orderId: string;
}

export const PayButtonComp = ({ orderId }: Props) => {
  const router = useRouter();

  const [charge, setCharge] = useState<{ clientSecret: string; id: string }>({
    clientSecret: '',
    id: '',
  });

  const { doRequest, isLoading } = useRequest({
    method: 'POST',
    body: { orderId, stripeId: charge.id },
    onSuccess: (data: StripeRes) => {
      if (!data.clientSecret) {
        console.log('No Client Secret ...');
        return;
      }

      setCharge(data);
    },
  });

  return (
    <>
      <PayNow
        title={isLoading ? 'Loading...' : 'Click To Pay'}
        successMessage="payment done, go back to main page"
        stripe={loadStripe(
          'pk_test_51NmwxdHLElqdJu8lqqrbsoikjEW4L32m3oQEFDVMNmeHFcERbkycP2ueLZ9qfreEX3jrfh7AZSoKJKP9tZOKaRbr00a6tT5sBo'
        )}
        clientSecret={charge.clientSecret}
        onClick={() => doRequest('/api/create-payment')}
        onPaymentSuccess={async () => {
          try {
            await doRequest('/api/success-payment');
            router.replace('/');
          } catch (error: any) {
            throw new Error(error.message);
          }
        }}
      />
    </>
  );
};
