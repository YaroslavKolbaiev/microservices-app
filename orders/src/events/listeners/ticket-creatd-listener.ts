import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@irickmcrs/common';
import { Ticket } from '../../models/Order-Ticket';
import { queueGroupName } from './queueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  /** when TICKET publisher sends event. method onMessage rcvs data
   * and creates new ticket in ORDERS DB
   * onMessage method runs in 'listen' method of Listener class
   * when message from nats server is received
   */
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const {
      id,
      title,
      price,
      // version
    } = data;

    /** to have same ID as TICKET DB, id property from data must be passed
     * to build method of TICKET model of ORDERS DB
     * */
    const ticket = Ticket.build({
      title,
      price,
      id,
      /** actually no need to assign version because it is set to 0
       * when it has been created */
      // version
    });

    await ticket.save();

    msg.ack();
  }
}
