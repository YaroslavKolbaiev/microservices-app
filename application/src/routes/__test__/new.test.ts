import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('has a route handler to listen post request', async () => {
  const res = await request(app).post('/api/application').send({});

  expect(res.status).not.toEqual(404);
});
it('can be only accesed if user sign in', async () => {
  await request(app)
    .post('/api/application')
    .send({}) // why send ?? try without ??
    .expect(401);

  // expect(res.status).toEqual(401);
});
it('returns status other than 401 if user is signed in', async () => {
  const res = await request(app)
    .post('/api/application')
    .set('Cookie', global.signup())
    .send({}); // why send ?? try without ??

  expect(res.status).not.toEqual(401);
});
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/application') // request path
    .set('Cookie', global.signup())
    .send({ title: '', price: 10 }) // request body
    .expect(400);
  await request(app)
    .post('/api/application') // request path
    .set('Cookie', global.signup())
    .send({ price: 10 }) // request body
    .expect(400);
});
it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/application') // request path
    .set('Cookie', global.signup())
    .send({ title: 'Opera', price: -10 }) // request body
    .expect(400);
  await request(app)
    .post('/api/application') // request path
    .set('Cookie', global.signup())
    .send({ title: 'Opera' }) // request body
    .expect(400);
});
// it('creates a ticket', async () => {
//   let tickets = await Ticket.find();
//   expect(tickets.length).toEqual(0);

//   await request(app)
//     .post('api/application')
//     .set('Cookie', global.signup())
//     .send({
//       title: 'Hello World!',
//       price: 20,
//     })
//     .expect(201);

//   tickets = await Ticket.find();
//   expect(tickets.length).toEqual(1);
//   expect(tickets[0].price).toEqual(20);
//   expect(tickets[0].title).toEqual('Hello World!');
// }); // will be available when conected to MONGO
