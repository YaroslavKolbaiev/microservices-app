import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from '@irickmcrs/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updeted-publisher';

export class orderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, ticket } = data;

    const ticketToUnReserve = await Ticket.findById(ticket.id);

    if (!ticketToUnReserve) {
      throw new NotFoundError();
    }

    ticketToUnReserve!.set({
      orderId: undefined,
    });

    await ticketToUnReserve.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticketToUnReserve.id,
      version: ticketToUnReserve.version,
      title: ticketToUnReserve.title,
      price: ticketToUnReserve.price,
      userId: ticketToUnReserve.userId,
      orderId: ticketToUnReserve.orderId,
    });

    msg.ack();
  }
}
