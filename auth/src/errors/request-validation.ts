import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class RequestValidationError extends CustomError {
  // the commented code means the same as the code in scopes
  // errors: ValidationError[]
  constructor(
    public errors: ValidationError[],
    public statusCode: number = 500
  ) {
    // this.errors = errors
    super('Invalid request parameter');
  }

  serializeErrors() {
    const formatedErrors = this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
    });

    return formatedErrors;
  }
}
