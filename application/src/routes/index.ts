import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

export const indexRouter = express.Router();

indexRouter.post(
  '/api-service/application/get-tickets',
  async (req: Request, res: Response) => {
    const { skip, limit } = req.body;
    // to find all ticket available for purchase
    // tickets with orderId property means already reserved
    const tickets = await Ticket.find({ orderId: undefined })
      .skip(skip)
      .limit(limit);
    const ticketsCount = (await Ticket.find({ orderId: undefined })).length;

    res.send({ tickets, ticketsCount });
  }
);
