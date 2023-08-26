import { Publisher } from './base-publisher';
import { Subjects } from './subject';
import { TicketUpdatedEvent } from './ticket-updated-event';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
