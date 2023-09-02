import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@irickmcrs/common';
import { queueGroupName } from '../queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Payment-Order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // version is not realy important here. just to be consistant
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.CANCELLED,
    });

    await order.save();

    msg.ack();
  }
}
