import request from 'supertest';
import { app } from '../../app';

const createTicket = (value: string) => {
  return request(app)
    .post('/api/application')
    .set('Cookie', global.signup())
    .send({ title: value, price: 30 });
};

it('should return all availabele tickets', async () => {
  await createTicket('1');
  await createTicket('2');
  await createTicket('3');
  await createTicket('4');

  const res = await request(app).get('/api/application').send().expect(200);

  console.log('[TEST_RES]', res.body);

  expect(res.body.length).toEqual(2);
});
