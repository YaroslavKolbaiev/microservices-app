import { Queue, Worker } from 'bullmq';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { stan } from '..';

/** to specify exact type of information to be used in Queue */
interface Payload {
  orderId: string;
}

const expirationQueue = new Queue('order:expiration', {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

const worker = new Worker<Payload>(
  'order:expiration',
  async (job) => {
    console.log(
      'I want to publish an expiration:complete event for id:',
      job.data.orderId
    );

    await new ExpirationCompletePublisher(stan).publish({
      orderId: job.data.orderId,
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: 6379,
    },
  }
);

export { expirationQueue };
