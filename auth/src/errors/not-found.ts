import { CustomError } from './customError';

export class NotFoundError extends CustomError {
  reason = 'Route does not Exist';
  statusCode = 404;
  constructor() {
    super('Route does not exist');
  }

  serializeErrors() {
    console.log(this.message);
    return [{ message: this.reason }];
  }
}
