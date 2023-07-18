import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to database';
  statusCode = 500;
  constructor() {
    super('Some issues with database');
  }

  serializeErrors() {
    console.log(this.message);
    return [{ message: this.reason }];
  }
}
