import express, { Request, Response } from 'express';

export const signOutRouter = express.Router();

signOutRouter.post('/api/users/sign-out', (req: Request, res: Response) => {
  req.session = null;

  // res.clearCookie('token', { httpOnly: true }).status(200).send({});
  res.send({}); // with kubernetes
});
