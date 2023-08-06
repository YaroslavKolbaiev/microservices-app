import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

export const indexRouter = express.Router();

indexRouter.get('/api/application', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({}); // to find all data in collection

  res.send(tickets);
});
