import express, { Request, Response } from 'express';

export const showRouter = express.Router();

showRouter.get('/api/orders/:orderId', async (req: Request, res: Response) => {
  res.send({});
});
