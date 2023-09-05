import nats, { Stan } from 'node-nats-streaming';

/** NatsWrapper is created in order to avoid importing circle
 * Singleton class
 */
class NatsWrapper {
  /** question mark indicates that property _client may be undefined for some period */
  private _client?: Stan;

  constructor() {}

  /** getter returns Stan client
   * it difined when client is connected to nats in 'connect' method
   * to be used as a parameter in publish event */
  get client() {
    if (!this._client) {
      throw new Error('Cannot acces NATS client before connecting');
    }

    return this._client;
  }

  /** connect method is to be run when service is started
   * Promise is implemented in order to use method asynchronosly
   */
  connect(clusterId: string, clientID: string, url: string) {
    /**  */
    this._client = nats.connect(clusterId, clientID, { url });

    return new Promise<void>((resolve, reject) => {
      /** getter 'client' is used insted of property _client */
      this.client.on('connect', () => {
        console.log('Connected to NATS');
      });
      resolve();
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
