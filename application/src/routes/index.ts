import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

export const indexRouter = express.Router();

indexRouter.get('/api/application', async (req: Request, res: Response) => {
  // to find all ticket available for purchase
  // tickets with orderId property means already reserved
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});
