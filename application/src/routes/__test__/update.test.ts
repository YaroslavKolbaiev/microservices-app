import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wraper';
import { Ticket } from '../../models/Ticket';

it('returns a 404 if provided ID not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/application/${id}`)
    .set('Cookie', global.signup())
    .send({
      title: 'Hello World!',
      price: 40,
    })
    .expect(404);
});
it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/application/${id}`)
    .send({
      title: 'Hello World!',
      price: 40,
    })
    .expect(401);
});
it('returns a 401 if user does not own the ticket', async () => {
  const res = await request(app)
    .post('/api/application')
    .set('Cookie', global.signup()) // one specific id is generated in cookies
    .send({
      title: 'Hello World!',
      price: 44,
    });

  await request(app)
    .put(`/api/application/${res.body.id}`)
    .set('Cookie', global.signup()) // differrent id then previous one is generated in cookies
    .send({
      title: 'Hello another World!',
      price: 24,
    })
    .expect(401);
});
it('returns a 400 if provided an invalid title or price', async () => {
  const cookie = global.signup(); // one cookie is generated
  const res = await request(app)
    .post('/api/application')
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'Hello World!',
      price: 44,
    });

  await request(app)
    .put(`/api/application/${res.body.id}`)
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: '',
      price: 24,
    })
    .expect(400);

  await request(app)
    .put(`/api/application/${res.body.id}`)
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'New World',
      price: -20,
    })
    .expect(400);
});
it('updates ticket if all data is valid', async () => {
  const cookie = global.signup(); // one cookie is generated
  const res = await request(app)
    .post('/api/application')
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'Hello World!',
      price: 44,
    });

  await request(app)
    .put(`/api/application/${res.body.id}`)
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'New Title',
      price: 24,
    })
    .expect(200);

  const updatedTicketresponse = await request(app)
    .get(`/api/application/${res.body.id}`)
    .send();

  expect(updatedTicketresponse.body.title).toEqual('New Title');
  expect(updatedTicketresponse.body.price).toEqual(24);
});

it('publishes an event', async () => {
  const cookie = global.signup(); // one cookie is generated
  const res = await request(app)
    .post('/api/application')
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'Hello World!',
      price: 44,
    });

  await request(app)
    .put(`/api/application/${res.body.id}`)
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'New Title',
      price: 24,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it('reject updates if ticket is reserved', async () => {
  const cookie = global.signup(); // one cookie is generated
  // first way of implementation
  // const res = await request(app)
  //   .post('/api/application')
  //   .set('Cookie', cookie) // same id will be provided from one cookie
  //   .send({
  //     title: 'Hello World!',
  //     price: 44,
  //   });

  // const ticket = await Ticket.findById(res.body.id);

  // second way of implementation
  const ticket = Ticket.build({
    title: 'UFC',
    price: 50,
    userId: 'someId',
  });

  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket?.save();

  await request(app)
    .put(`/api/application/${ticket.id}`)
    .set('Cookie', cookie) // same id will be provided from one cookie
    .send({
      title: 'New Title',
      price: 24,
    })
    .expect(400);
});
