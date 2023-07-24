import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// we add optional property "currentUser" to Request interface.
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // we check if jwt seession is set, if not continue to next middleware
  // if i dont put question mark, type script gives error
  // because type script doest know if seession defined or not
  // other solution would be to write following check "!req.session || !req.session.jwt"
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // to specify exact value of payload we create interface UserPayload
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    res.send({ currentUser: null });
  }

  next();
};
