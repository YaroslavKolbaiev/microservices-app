import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returs 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // generate valid mongo ID for test
  const res = await request(app)
    .get(`/api-service/application/${id}`)
    .send()
    .expect(404);
});

it('returs ticket if ticket is found', async () => {
  const res = await request(app)
    .post('/api-service/application')
    .set('Cookie', global.signup())
    .send({ title: 'Hello World!', price: 10 })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api-service/application/${res.body.id}`)
    /** cookie is not set because ticket may see even not authenticated person */
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual('Hello World!');
  expect(ticketResponse.body.price).toEqual(10);
});
