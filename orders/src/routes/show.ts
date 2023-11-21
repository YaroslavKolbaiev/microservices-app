import { NotAuthorized, NotFoundError, requireAuth } from '@irickmcrs/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/Order';

export const showRouter = express.Router();

showRouter.get(
  '/api-service/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    res.status(200).send(order);
  }
);
