import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event Data:', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    /** aknowladge that msg is rcvd */
    msg.ack();
  }
}
