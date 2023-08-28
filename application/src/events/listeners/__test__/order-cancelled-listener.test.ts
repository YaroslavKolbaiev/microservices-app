import mongoose from 'mongoose';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wraper';
import { orderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent } from '@irickmcrs/common';

const setup = async () => {
  /** create instance of the listener */
  const listener = new orderCancelledListener(natsWrapper.client);

  /** Create and save a ticket */
  const ticket = Ticket.build({
    title: 'Usyk Fury',
    price: 50,
    userId: 'userId',
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();

  ticket.set({ orderId });

  await ticket.save();

  /** Create fake data event */

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    // does not matter here
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it('sets orderId of the ticket to undefined', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(undefined);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).toEqual(undefined);
});
