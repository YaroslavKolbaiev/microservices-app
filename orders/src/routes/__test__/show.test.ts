import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Order-Ticket';
import mongoose from 'mongoose';

it('throws error if user is not owner of ticket', async () => {
  const owner = global.signup();
  const onotherPerson = global.signup();
  const ticket = Ticket.build({
    title: 'NBA Finals',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.save();

  const createRes = await request(app)
    .post('/api/orders')
    .set('Cookie', owner)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${createRes.body.id}`)
    .set('Cookie', onotherPerson)
    .send()
    .expect(401);
});
it('returns order if order is found', async () => {
  const user = global.signup();
  const ticket = Ticket.build({
    title: 'NBA Finals',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.save();

  const createRes = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const orderResponse = await request(app)
    .get(`/api/orders/${createRes.body.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(orderResponse.body).toEqual(createRes.body);
});
