import nats from 'node-nats-streaming';
import { TicketUpdatedPublisher } from './events/ticket-update-publisher';

console.clear();

const stan = nats.connect('microservices', 'abcd', {
  url: 'http://localhost:4222',
}); // create client to connets to nats streaming services

stan.on('connect', async () => {
  console.log('Update-Publisher connetted to nats');

  const data = {
    id: '64b88371ea6691db7452b8fc',
    title: 'new Tilte',
    price: 15,
    version: 1,
  };

  await new TicketUpdatedPublisher(stan).publish(data);
}); // this function is executed when client succesfully connected to server

stan.on('error', async (error) => {
  console.log(error);
});
