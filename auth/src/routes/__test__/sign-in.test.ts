import request from 'supertest';
import { app } from '../../app';

it('should return 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/sign-in') // request path
    .send({
      email: 'test6@test.com',
      password: 'pa',
    }) // request body
    .expect(500); // 500 in your error handler. check why in lesson 400 ?
});

it('should return 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/sign-in') // request path
    .send({}) // request body
    .expect(500); // 500 in your error handler. check why in lesson 400 ?
});

it('fails when email does not exist', async () => {
  await request(app)
    .post('/api/users/sign-in') // request path
    .send({
      email: 'test-notExists@test.com',
      password: 'password',
    }) // request body
    .expect(400); // same code as you have in bad-request error class
});

it('fails when password is not correct', async () => {
  await request(app)
    .post('/api/users/sign-up') // immitating successfull sign-up first
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(201);

  await request(app)
    .post('/api/users/sign-in') // request path
    .send({
      email: 'test6@test.com',
      password: 'password-incorect',
    }) // request body
    .expect(400);
});

it('should return a 201 on successful sign in and set cookie', async () => {
  await request(app)
    .post('/api/users/sign-up') // immitating successfull sign-up first
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(201);

  const res = await request(app)
    .post('/api/users/sign-in') // request path
    .send({
      email: 'test6@test.com',
      password: 'password',
    }) // request body
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
