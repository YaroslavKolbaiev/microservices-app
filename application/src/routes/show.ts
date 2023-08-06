import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import { NotFoundError } from '@irickmcrs/common';

export const showRoute = express.Router();

showRoute.get('/api/application/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).send(ticket);
});
