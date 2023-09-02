import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequest,
  NotFoundError,
} from '@irickmcrs/common';
import { Order } from '../models/Payment-Order';

const router = express.Router();

router.post(
  '/api/payment/',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
