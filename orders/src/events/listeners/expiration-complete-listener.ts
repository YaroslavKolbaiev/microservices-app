import {
  Listener,
  ExpirationCompleteEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
  BadRequest,
} from '@irickmcrs/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

/** listen for expiration event */
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // on receiving msg from exporation publisher find order by ID
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.COMPLETE) {
      return msg.ack();
    }

    // time is expired, set status of order to CANCELLED
    order.set({
      status: OrderStatus.CANCELLED,
    });

    await order.save();

    // reference to nats client is 'THIS'
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      // **************** POPULATE ORDER WITH TICKET *********************
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
