import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wraper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { orderCancelledListener } from './events/listeners/order-cancelled-listener';

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  if (!process.env.mongoUrl) {
    throw new Error('MONGO_URL must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS is closed...');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    await mongoose.connect(process.env.mongoUrl);
  } catch (error: any) {
    throw new Error(error.message);
  }

  new OrderCreatedListener(natsWrapper.client).listen();
  new orderCancelledListener(natsWrapper.client).listen();

  app.listen(PORT, () => {
    /** for cubernetes must be same port */
    console.log('Listening on port:', PORT);
  });
};
start();
