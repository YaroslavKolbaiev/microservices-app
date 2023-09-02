/** when create ticket test runs it imports below fake natsWrapper
 * publish method comes from base-paublisher from common module
 * it has three paramenters subject, data and callback fn and returns callback fn
 */
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      /** this is a acctual function wich will be invoked when someone tries to run publish */
      (subject: string, data: string, callback: () => void) => {
        callback();
      }
    ),
  },
};
