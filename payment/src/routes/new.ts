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
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api-service/payment/',
  requireAuth,
  [body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

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

    const charge = await stripe.paymentIntents.create({
      // multiply by 100 to convert to cents
      amount: order.price * 100,
      currency: 'usd',
      description: `Test payment for ${order.id}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).send({ clientSecret: charge.client_secret, id: charge.id });
  }
);

export { router as createChargeRouter };
