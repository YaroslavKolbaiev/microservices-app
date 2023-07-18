import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';

export function errorMiddleware(
  error: CustomError, // takes value of error being thrown from router
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() });
  }

  res.status(400).send({ errors: [{ message: 'Unknown error' }] });
}
