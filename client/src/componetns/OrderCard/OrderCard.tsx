'use client';
import { Order } from '@/types/Order';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { CurrentUser } from '@/types/User';
import Link from 'next/link';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const OrderCard = ({
  order,
  currentUser,
}: {
  order: Order;
  currentUser: CurrentUser;
}) => {
  const [minLeft, setMinLeft] = useState<number>(0);
  const [secLeft, setSecLeft] = useState<number>(0);

  const totalSec = useMemo(() => {
    return +new Date(order.expiresAt) - +new Date();
  }, []);

  useEffect(() => {
    const findTimeLeft = () => {
      // time in ms remaining to cancel order.
      const msLeft = +new Date(order.expiresAt) - +new Date();
      //
      setMinLeft(Math.floor(msLeft / 1000 / 60));
      setSecLeft(Math.round(msLeft / 1000));
    };

    // it updates timeLeft straight away in order to display time left on page render
    findTimeLeft();

    // every second calls findTimeLeft fn and re-renders value on the page
    const timerId = setInterval(findTimeLeft, 1000);

    // interval will continue to count even after 0 to negative value
    // and will keep counting even after leaving the page
    // in order to stop counter after navigating away of the page
    // we have to return function with return value clearInterval
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const timeRemaining = () => {
    return secLeft % 60 < 10
      ? `${minLeft} : 0${secLeft % 60}`
      : `${minLeft} : ${secLeft % 60}`;
  };

  if (secLeft < 0) {
    return (
      <div>
        <p className="text-red-500 text-center">Order has expired</p>
        <Link className="text-sky-400" href="/">
          Go Back To Main Page
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className="p-12
          flex 
          items-center 
          flex-col
          border-stone-300
          border
          rounded-lg
          shadow-lg 
          min-w-[290px]
          dark:border-stone-700
          dark:shadow-slate-700
        "
      >
        <h2 className="text-slate-600 text-4xl dark:text-slate-300">
          {order.ticket.title}
        </h2>
        <CircularProgressbar
          className="my-6"
          value={secLeft}
          maxValue={totalSec / 1000}
          text={timeRemaining()}
          counterClockwise
          styles={{
            text: {
              fill: 'gray',
            },
          }}
        />
        <StripeCheckout
          token={(token) => console.log(token)}
          stripeKey="pk_test_51NmwxdHLElqdJu8lqqrbsoikjEW4L32m3oQEFDVMNmeHFcERbkycP2ueLZ9qfreEX3jrfh7AZSoKJKP9tZOKaRbr00a6tT5sBo"
          // to convert cents to USD
          amount={+order.ticket.price * 100}
          email={currentUser.email}
        />
      </div>
      <ToastContainer />
    </>
  );
};

export default OrderCard;
