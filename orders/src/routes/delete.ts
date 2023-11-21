import { NotAuthorized, NotFoundError, requireAuth } from '@irickmcrs/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/Order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wraper';

export const deleteRouter = express.Router();

deleteRouter.delete(
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

    order.status = OrderStatus.CANCELLED;
    await order.save();

    /** pubslish event saying this order cancelled */
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      // version: order.__v, *** why i make __v ? ***
      ticket: {
        /** in order to have reference to ticket from order
         * when fetching order, we have to 'populate('ticket')'
         * without populate it would be not possible to reference ticket.id
         */
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);
