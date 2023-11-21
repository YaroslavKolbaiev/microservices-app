import express, { Request, Response } from 'express';

export const signOutRouter = express.Router();

signOutRouter.post(
  '/api-service/users/sign-out',
  (req: Request, res: Response) => {
    res.clearCookie('token', { httpOnly: true }).status(200).send({});
  }
);
