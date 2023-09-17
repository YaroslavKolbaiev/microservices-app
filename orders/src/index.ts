import 'dotenv/config'; // you dont need this lib if you use docker
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wraper';
import { TicketCreatedListener } from './events/listeners/ticket-creatd-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  // check if MONGO_URL and JWT exists in env before running code.
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

    /** after conncting to NATS server, we start listening to events */

    await mongoose.connect(process.env.mongoUrl); // with mongo Atlas
  } catch (error) {
    console.log(error);
  }

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();

  app.listen(3000, () => {
    /** for cubernetes must be same port */
    console.log('Listening on port 3000');
  });
};
start();
