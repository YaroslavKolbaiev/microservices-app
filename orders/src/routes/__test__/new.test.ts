import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/Order';
// import { natsWrapper } from '../../nats-wraper';

it('has a route handler to listen post request', async () => {
  const res = await request(app).post('/api/orders');

  expect(res.status).not.toEqual(404);
});
it('can be only accesed if user sign in', async () => {
  /** request sent without cookie what means that user is not signed-in */
  await request(app).post('/api/orders').expect(401);

  // expect(res.status).toEqual(401);
});
it('returns status other than 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup());

  expect(res.status).not.toEqual(401);
});
it('returns an error if ticketId is not provided', async () => {
  await request(app)
    .post('/api/orders') // request path
    .set('Cookie', global.signup())
    .send({ ticketId: '' }) // request body
    .expect(400);
});
// it('returns an error if ticketId is invalid', async () => {
//   await request(app)
//     .post('/api/orders') // request path
//     .set('Cookie', global.signup())
//     .send({ ticketId: 1245 }) // request body
//     .expect(400);
// });
it('returns an error if ticket does not exist', async () => {
  /** generate random id which doesnt acctully exist */
  const ticketId = new mongoose.Types.ObjectId();
  /** send request with not existing in DB id */
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404);
});
it('returns an error if ticket is already reserved', async () => {
  /** create a ticket in fake DB */
  const ticket = Ticket.build({
    title: 'UFC300',
    price: 100,
  });
  /** save ticket */
  ticket.save();
  /** create a order which means that ticket is reserved */
  const order = Order.build({
    userId: 'some random string',
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  /** send request with already  reserved ticketId */
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400);
});
it('reserves a ticket', async () => {
  /** create a ticket in fake DB */
  const ticket = Ticket.build({
    title: 'UFC300',
    price: 100,
  });
  /** save ticket */
  ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201);
});
it.todo('publish an event saying order is created');
