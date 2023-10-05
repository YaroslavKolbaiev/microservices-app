import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Payment-Order';
import { OrderStatus } from '@irickmcrs/common';
import jwt from 'jsonwebtoken';
import { stripe } from '../../stripe';
import { Payment } from '../../models/Payment';

// jest.mock('../../stripe');

function setupUser(userId: string) {
  const payload = {
    email: 'any-email@test.com',
    id: userId,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return [`session=${base64}`]; // for kubernetes
  return [`${token}`]; // for local implementation
}

it('returns 404 error if order does not exist', async () => {
  const orderId = new mongoose.Types.ObjectId();

  const res = await request(app)
    .post('/api/payment')
    .set('Cookie', global.signup())
    .send({ orderId })
    .expect(404);
});

it('throws 401 if user does not own a ticket', async () => {
  const order = Order.build({
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  const res = await request(app)
    .post(`/api/payment`)
    .set('Cookie', global.signup())
    .send({ token: 'random', orderId: order.id })
    .expect(401);
});

it('throws 400 if order was cancelled', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = setupUser(userId);
  const order = Order.build({
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CANCELLED,
    userId,
  });
  await order.save();

  await request(app)
    .post(`/api/payment`)
    .set('Cookie', user)
    .send({ orderId: order.id })
    .expect(400);
});

it('creates stripe clinet secret', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = setupUser(userId);
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    price,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId,
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .set('Cookie', user)
    .send({ orderId: order.id })
    .expect(201);

  // is mock fn from __mocks__
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(50 * 100);
  // expect(chargeOptions.currency).toEqual('usd');

  // THE LOGIC TO RUN REAL STRIPE TEST
  // first we create separate price variable and assign to order price
  // every time we make charges in stripe, stripe saves all charges in a list
  // to make sure our stripe service works, we must to look in charges list
  // and if we able to find object with amount equal to price, it means all working

  const stipeCharges = await stripe.paymentIntents.list({ limit: 50 });

  const stripeCharge = stipeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');
  expect(stripeCharge!.amount).toEqual(price * 100);
}, 15000);
