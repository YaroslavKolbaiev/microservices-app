import { Publisher, Subjects, TicketUpdatedEvent } from '@irickmcrs/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
