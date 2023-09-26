'use client';
import useRequest from '@/hooks/use-request';
import React, { useState } from 'react';
import { PayNow, loadStripe } from 'react-stripe-js';

export const PayButtonComp = ({ orderId }: { orderId: string }) => {
  const stripe = loadStripe(
    'pk_test_51NmwxdHLElqdJu8lqqrbsoikjEW4L32m3oQEFDVMNmeHFcERbkycP2ueLZ9qfreEX3jrfh7AZSoKJKP9tZOKaRbr00a6tT5sBo'
  );

  const [clientSecret, setClientSecret] = useState<string>('');

  const { doRequest, isLoading } = useRequest({
    url: '/api/create-payment',
    method: 'POST',
    body: { orderId },
    onSuccess: (data) => setClientSecret(data.clientSecret),
  });

  // const createPaymentIntent = () => {
  //   if (!clientSecret) {
  //     fetch('http://localhost:3005/api/payment', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ orderId }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setClientSecret(data.clientSecret));
  //   }
  // };

  return (
    <>
      <PayNow
        title={isLoading ? 'Loading...' : 'Click To Pay'}
        successMessage="payment done,creating order please wait...."
        stripe={stripe}
        clientSecret={clientSecret}
        onClick={doRequest}
        onPaymentSuccess={() => {
          console.log('wow, payment done....store the order info into db now.');
        }}
      />
    </>
  );
};
