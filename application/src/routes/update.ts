import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import {
  NotAuthorized,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@irickmcrs/common';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wraper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updeted-publisher';

export const updateRoute = express.Router();

updateRoute.put(
  '/api/application/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title must be valid'),
    body('price')
      .isFloat({ gt: 0 }) // float means number which has decimal. gt - means greater then
      .withMessage('Price Must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorized();
    }

    ticket.set({
      title,
      price,
    }); // updates ticket in memory
    await ticket.save(); // updates ticket in MONGO DB

    const data = {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    };

    /** there might be an issue if for some reason after ticket is updated and saved to DB
     * the error is ocured in NATS publisher and other services will not be notified about transaction
     * the solution is to store boolean value in DB together with ticket whether or not event has benn published
     * and create separate code logic to watch that event is published and if not
     * than retrive transaction and cancell saving updated ticket in DB
     * above is for awareness and not be implemented (at least now) in the project
     */
    new TicketUpdatedPublisher(natsWrapper.client).publish(data);

    // try to implement "UpdateOne"

    res.send(ticket);
  }
);
