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
import { Payment } from '../models/Payment';
import { PaymentCreatedPublidher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wraper';

const router = express.Router();

router.post(
  '/api/payment/',
  requireAuth,
  // [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  [body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    // const { token, orderId } = req.body;
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
      // source: token,
      description: `Test payment for ${order.id}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // MAYBE PAYMENT MUST BE IN OTHER REQUEST

    // const payment = Payment.build({
    //   orderId,
    //   stripeId: charge.id,
    // });
    // await payment.save();

    // new PaymentCreatedPublidher(natsWrapper.client).publish({
    //   id: payment.id,
    //   orderId: payment.orderId,
    //   stripeId: payment.stripeId,
    // });

    // res.status(201).send({ id: payment.id });
    res.status(201).send({ clientSecret: charge.client_secret });
  }
);

export { router as createChargeRouter };
