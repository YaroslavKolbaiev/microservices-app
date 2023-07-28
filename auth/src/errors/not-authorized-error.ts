import { CustomError } from './customError';

export class NotAuthorized extends CustomError {
  reason = 'You are not authorized';
  statusCode = 401;
  constructor() {
    super('Not authorized');
  }

  serializeErrors() {
    console.log(this.message);
    return [{ message: this.reason }];
  }
}
