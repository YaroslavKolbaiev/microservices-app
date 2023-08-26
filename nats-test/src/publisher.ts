import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('microservices', 'abcd', {
  url: 'http://localhost:4222',
}); // create client to connets to nats streaming services

stan.on('connect', async () => {
  console.log('Publisher connetted to nats');

  const data = {
    id: '64b88371ea6691db7452b8fc',
    title: 'Hello World!',
    price: 20,
  };

  await new TicketCreatedPublisher(stan).publish(data);
}); // this function is executed when client succesfully connected to server

stan.on('error', async (error) => {
  console.log(error);
});

// id: new mongoose.Types.ObjectId().toHexString()
