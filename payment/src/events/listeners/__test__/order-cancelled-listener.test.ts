import { OrderCancelledEvent, OrderStatus } from '@irickmcrs/common';
import { Order } from '../../../models/Payment-Order';
import { natsWrapper } from '../../../nats-wraper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import mongoose from 'mongoose';

const setup = async () => {
  /** create instance of the listener */
  const listener = new OrderCancelledListener(natsWrapper.client);

  /** Create and save a ticket */
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
    version: 0,
    price: 50,
    userId: 'userId',
  });

  await order.save();

  /** Create fake data event */

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

it('sets order status to CANCELLED', async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('throws error if ticket is not found', async () => {
  const { listener, msg } = await setup();

  const wrongData: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    // does not matter here
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  try {
    await listener.onMessage(wrongData, msg);
  } catch (error: any) {
    expect(error).toBeDefined();
  }
});
