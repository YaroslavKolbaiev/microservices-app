import {
  BadRequest,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@irickmcrs/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/Order-Ticket';
import { Order } from '../models/Order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wraper';

export const newRouter = express.Router();

newRouter.post(
  '/api-service/orders/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      /** custom (optional) method to check if provided id is MongoDB type ID
       * input parameter is ticketId
       */
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TickedId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    /** find ticket in DB that user wants to order */
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    /** make sure that ticket is not reserved
     * run query to look at all orders. find an order where the ticket
     * is the ticket we just found *and* the orders status is *not* cancelled.
     * if we find an order from that, it means the ticket *is reserved*
     */
    const isReserved = await ticket.isReserved();
    /** if 'existingOrder' returns true it means that ticket is reserved */
    if (isReserved) {
      throw new BadRequest('Ticket is already reserved');
    }

    /** calculate exparation date of order */
    const expiration = new Date();
    /** set expiration period equals to 1min */
    expiration.setSeconds(expiration.getSeconds() + 5 * 60);

    /** build the order and save to DB */
    const order = Order.build({
      /** userId comes from request(cookie) */
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    const data = {
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };

    /** publish an event saying order is created */
    new OrderCreatedPublisher(natsWrapper.client).publish(data);

    res.status(201).send(order);
  }
);
