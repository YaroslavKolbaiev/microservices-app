import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Order-Ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/Order';
import { natsWrapper } from '../../nats-wraper';

it('throws 404 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${id}`).expect(401);
});

it('throws 401 if user is not owner of ticket', async () => {
  const owner = global.signup();
  const onotherPerson = global.signup();
  const ticket = Ticket.build({
    title: 'NBA Finals',
    price: 50,
  });
  ticket.save();

  const createRes = await request(app)
    .post('/api/orders')
    .set('Cookie', owner)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${createRes.body.id}`)
    .set('Cookie', onotherPerson)
    .send()
    .expect(401);
});

it('sets status of order as cancelled', async () => {
  const user = global.signup();
  const ticket = Ticket.build({
    title: 'NBA Finals',
    price: 50,
  });
  ticket.save();

  const createRes = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${createRes.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(createRes.body.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.CANCELLED);
});
it('sets status of order as cancelled', async () => {
  const user = global.signup();
  const ticket = Ticket.build({
    title: 'NBA Finals',
    price: 50,
  });
  ticket.save();

  const createRes = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${createRes.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
