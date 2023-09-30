import { OrderStatus, requireAuth } from '@irickmcrs/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/Order';

export const indexRouter = express.Router();

indexRouter.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    /** find all orders of user that made a request */
    const orders = await Order.find({
      userId: req.currentUser!.id,
      status: OrderStatus.COMPLETE,
    }).populate('ticket');
    /** to include ticket that the order is for, use mongoose 'populate' method */

    res.send(orders);
  }
);
