import { Listener, OrderCreatedEvent, Subjects } from '@irickmcrs/common';
import { queueGroupName } from '../queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Payment-Order';

// import { TicketUpdatedPublisher } from '../publishers/ticket-updeted-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, userId, status, ticket } = data;

    const order = Order.build({
      id,
      version,
      userId,
      status,
      price: ticket.price,
    });

    await order.save();

    msg.ack();
  }
}
