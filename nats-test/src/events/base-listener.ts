import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subject';

interface Event {
  subject: Subjects;
  data: any;
}
/** whenever we use 'Listener' custom type is provided
 * T refers to Event interface
 * by saying T['subject'] means Event['subject']
 */
export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  /**
   * to set options in subscription instead of object
   * nats useses chained methods
   */
  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        //**get all events emited in the past */
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        /**
         * tracking events.
         * checks if no events are missed
         * checks if no events are reprocessed several times
         */
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subsciption = this.client.subscribe(
      this.subject,
      /**specify group to avoid dublication */
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subsciption.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
