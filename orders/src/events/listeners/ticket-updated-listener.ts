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

    try {
      /** custom method to find ticket by id and version implemented in Order-Ticket model */
      const ticket = await Ticket.findByIdAndVersion(data);

      ticket?.set({
        title,
        price,
        version,
      });

      await ticket?.save();
    } catch (error) {
      throw new Error('ticket not found');
    }

    /** custom method to find ticket by id and version implemented in Order-Ticket model */
    // const ticket = await Ticket.findByIdAndVersion(data);

    // if (!ticket) {
    //   throw new Error('ticket not found');
    // }

    // ticket.set({
    //   title,
    //   price,
    //   version,
    // });

    // await ticket.save();

    msg.ack();
  }
}
