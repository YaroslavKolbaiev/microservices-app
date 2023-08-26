import { OrderCreatedEvent, Publisher, Subjects } from '@irickmcrs/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
