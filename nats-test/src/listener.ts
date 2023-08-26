import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const id = randomBytes(4).toString('hex');

const stan = nats.connect('microservices', id, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS', id);

  stan.on('close', () => {
    console.log('NATS is closed...');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

/**watchers for interapt or terminate signals
 * it runs when programs restarts or when pressing ctrl+c
 * and executes callback 'stan.close()'
 * when NATS client is terminated or interapted, NATS server has option
 * to wait some time for client to return to online state
 * in order to immedietly kill client we listen for events 'SIGINT' or 'SIGTERM'
 * and when they executed we emit event 'stan.close()' to immediatly close the connection
 */
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
