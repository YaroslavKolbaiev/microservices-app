import express, { Request, Response } from 'express';

export const deleteRouter = express.Router();

deleteRouter.get(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    res.send({});
  }
);
