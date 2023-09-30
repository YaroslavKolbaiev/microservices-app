import { Request, Response, NextFunction } from 'express';
import { jwtHelper } from './jwtHelper';

interface UserPayload {
  id: string;
  email: string;
}

// middleware to be used when running services localy

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // IMPLEMENTATION WITH COOKIE PARSER
  const tokken = req.headers.cookie;
  if (!tokken) {
    return next();
  }

  try {
    const payload = jwtHelper.validateAccessToken(tokken);
    req.currentUser = payload as UserPayload;
  } catch (error) {
    return res.send({ currentUser: null });
  }

  next();
};
