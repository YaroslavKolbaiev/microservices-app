import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Payment-Order';
import { OrderStatus } from '@irickmcrs/common';
import { Payment } from '../../models/Payment';
import jwt from 'jsonwebtoken';
import { natsWrapper } from '../../nats-wraper';

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

it('creates payment in DB', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = setupUser(userId);

  const order = Order.build({
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId,
  });
  await order.save();

  const stripeId = 'Some-Id1';

  await request(app)
    .post('/api/success')
    .set('Cookie', user)
    .send({ stripeId, orderId: order.id })
    .expect(201);

  const payment = await Payment.findOne({
    orderId: order.id,
  });

  expect(payment).not.toBeNull();
  expect(payment?.stripeId).toEqual(stripeId);
});

it('it publishes an payment created event', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = setupUser(userId);

  const order = Order.build({
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.CREATED,
    userId,
  });
  await order.save();

  const stripeId = 'Some-Id1';

  await request(app)
    .post('/api/success')
    .set('Cookie', user)
    .send({ stripeId, orderId: order.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
