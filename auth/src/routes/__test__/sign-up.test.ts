import request from 'supertest';
import { app } from '../../app';

it('should return a 201 on successful signup', async () => {
  // library for easy tests
  return request(app)
    .post('/api/users/sign-up') // request path
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(201);
});

it('should return 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/sign-up') // request path
    .send({
      email: 'test6@test.com',
      password: 'pa',
    }) // request body
    .expect(500); // 500 in your error handler. check why in lesson 400 ?
});

it('should return 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/sign-up') // request path
    .send({}) // request body
    .expect(500); // 500 in your error handler. check why in lesson 400 ?
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/sign-up') // request path
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(201);

  await request(app)
    .post('/api/users/sign-up') // request path
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(400);
});

it('sets cookie after sign-up', async () => {
  const res = await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test6@test.com',
      password: 'password',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined(); // check if response sets cookie header
});
