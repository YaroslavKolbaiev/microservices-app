import { OrderCancelledEvent, Publisher, Subjects } from '@irickmcrs/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
