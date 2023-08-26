import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from '@irickmcrs/common';
import { Ticket } from '../../models/Order-Ticket';
import { queueGroupName } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, version } = data;

    /** custom method to find ticket by id and version implemented in Order-Ticket model */
    const ticket = await Ticket.findByIdAndVersion(data);

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({
      title,
      price,
      version,
    });

    await ticket.save();

    msg.ack();
  }
}
