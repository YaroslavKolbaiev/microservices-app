import { PaymentCreatedEvent, Publisher, Subjects } from '@irickmcrs/common';

export class PaymentCreatedPublidher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
