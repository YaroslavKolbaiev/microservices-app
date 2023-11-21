import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequest,
  NotFoundError,
  NotAuthorized,
  OrderStatus,
} from '@irickmcrs/common';
import { Order } from '../models/Payment-Order';
import { Payment } from '../models/Payment';
import { PaymentCreatedPublidher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wraper';

const router = express.Router();

router.post(
  '/api-service/success/',
  requireAuth,
  [body('stripeId').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, stripeId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequest('Order is cancelled');
    }

    const payment = Payment.build({
      orderId,
      stripeId,
    });
    await payment.save();

    new PaymentCreatedPublidher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as successRouter };
