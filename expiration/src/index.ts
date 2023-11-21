import { OrderListener } from './events/order-listener';
import nats from 'node-nats-streaming';

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID must be defined');
}
if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID must be defined');
}
if (!process.env.NATS_URL) {
  throw new Error('NATS_URL must be defined');
}

export const stan = nats.connect(
  process.env.NATS_CLUSTER_ID,
  process.env.NATS_CLIENT_ID,
  {
    url: process.env.NATS_URL,
  }
);

const start = async () => {
  stan.on('connect', () => {
    console.log('Listener connected to NATS', process.env.NATS_CLIENT_ID);

    stan.on('close', () => {
      console.log('NATS is closed...');
      process.exit();
    });

    new OrderListener(stan).listen();
  });
};
start();
