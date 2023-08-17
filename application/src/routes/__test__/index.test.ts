import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/application')
    .set('Cookie', global.signup())
    .send({ title: 'Hello World!', price: 30 });
};

it('should return all availabele tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/application').send().expect(200);

  expect(res.body.length).toEqual(3);
});
