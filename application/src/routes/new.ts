import { requireAuth, validateRequest } from '@irickmcrs/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wraper';

export const newTicketRoute = express.Router();

newTicketRoute.post(
  '/api-service/application',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title must be valid'),
    body('price')
      .isFloat({ gt: 0 }) // float means number which has decimal. gt - means greater then
      .withMessage('Price Must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    const data = {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    };

    await new TicketCreatedPublisher(natsWrapper.client).publish(data);

    res.status(201).send(ticket);
  }
);
