import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from '@irickmcrs/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updeted-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket } = data;

    const ticketToReserve = await Ticket.findById(ticket.id);

    if (!ticketToReserve) {
      throw new NotFoundError();
    }

    ticketToReserve!.set({
      orderId: id,
    });

    await ticketToReserve.save();

    console.log('[ticketVersion in app]', ticketToReserve.version);

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketToReserve.id,
      version: ticketToReserve.version,
      title: ticketToReserve.title,
      price: ticketToReserve.price,
      userId: ticketToReserve.userId,
      orderId: ticketToReserve.orderId,
    });

    msg.ack();
  }
}
