import express, { Request, Response } from 'express';

export const signOutRouter = express.Router();

signOutRouter.get('/api/users/sign-out', (req: Request, res: Response) => {
  req.session = null;

  res.send({});
});
