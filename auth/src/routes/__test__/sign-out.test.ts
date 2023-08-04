import request from 'supertest';
import { app } from '../../app';

it('clears cookie after sign out', async () => {
  await request(app)
    .post('/api/users/sign-up') // immitating successfull sign-up first
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(201);

  const res = await request(app).get('/api/users/sign-out');

  expect(res.get('Set-Cokkie')).toBeDefined();
});
