import express, { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';
import {
  NotAuthorized,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@irickmcrs/common';
import { body } from 'express-validator';

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

    // try to implement "UpdateOne"

    res.send(ticket);
  }
);
