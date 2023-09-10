import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  NotFoundError,
  OrderStatus,
} from '@irickmcrs/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { id, orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({
      status: OrderStatus.COMPLETE,
    });

    await order.save();

    // normaly after something has been created or updated
    // new event has to be published in order to notify other services
    // and increment version number for concurency
    // in this case this is not required due to completed order
    // will not be adressed anymore

    msg.ack();
  }
}
