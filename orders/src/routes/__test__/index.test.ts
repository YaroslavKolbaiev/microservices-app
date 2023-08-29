import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Order-Ticket';
import mongoose from 'mongoose';

const buildTicket = () => {
  const ticket = Ticket.build({
    title: 'UFC340',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  /** save ticket */
  return ticket.save();
};

it('fetches orders or particular user', async () => {
  /** Create three tickets */
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  /** make sure users are authorized */
  const userOne = global.signup();
  const userTwo = global.signup();
  /** create one order as User1 */
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  /** create two order as User2 */
  const {
    body: orderOne /**destructure body and straight away rename to orderOne */,
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);
  /** Make request to get orders for User2 */
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);
  /** Make sure we got orders for User2 */
  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(orderOne.id);
  expect(res.body[1].id).toEqual(orderTwo.id);
});
