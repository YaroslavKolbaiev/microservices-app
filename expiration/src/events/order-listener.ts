import { Listener, OrderCreatedEvent, Subjects } from '@irickmcrs/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../queues/expiration-queue';

export class OrderListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    /** obtain time difference in ms */
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    /**  */
    await expirationQueue.add('myJob', { orderId: data.id }, { delay });

    msg.ack();
  }
}
