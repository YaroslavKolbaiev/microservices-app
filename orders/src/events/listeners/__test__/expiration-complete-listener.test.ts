import { ExpirationCompleteEvent, OrderStatus } from '@irickmcrs/common';
import { natsWrapper } from '../../../nats-wraper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/Order';
import { Ticket } from '../../../models/Order-Ticket';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'UEFA final',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    userId: 'myId',
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

it('sets order status to cancelled', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.orderId).populate('ticket');

  console.log('[ORDER]', order?.ticket);
  console.log('[TICKET]', ticket);

  expect(order?.status).toEqual(OrderStatus.CANCELLED);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('emit an OrderCancelled event', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('emit an OrderCancelled event with ticket property', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.ticket.id).toEqual(order.ticket.id);
});

it('throws not found if order not exists', async () => {
  const { listener, msg } = await setup();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: new mongoose.Types.ObjectId().toHexString(),
  };

  try {
    await listener.onMessage(data, msg);
  } catch (error: any) {
    return expect(error.message).toEqual('Route does not exist');
  }

  // should not reach this poit
  throw new Error();
});
