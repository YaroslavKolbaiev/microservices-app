import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req); // any errors coming from user request

  // if erors array is not empty we run bellow command
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
