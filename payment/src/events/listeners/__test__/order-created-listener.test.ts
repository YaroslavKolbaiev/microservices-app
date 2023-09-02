import { OrderCreatedEvent, OrderStatus } from '@irickmcrs/common';
import { natsWrapper } from '../../../nats-wraper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/Payment-Order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId: 'hello',
    expiresAt: 'no matter',
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 50,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const createdOrder = await Order.findById(data.id);

  expect(createdOrder?.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
