import request from 'supertest';
import { app } from '../../app';

it('responds with details with current user', async () => {
  // in browser cookies are saved.
  // but here, in test evirinment cookies are not being saved anywhere
  // the following request will asume we are not unouthorized
  // that is why we must extract cookies from 'signUpRes' and include in the followed request

  const cookie = await global.signup();

  const res = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie) // include cookie in request
    .send() // why send ?? try without ??
    .expect(200);

  expect(res.body.currentUser.emai).toEqual('test6@test.com');
});

it('should return user equal to null if no cookies provided', async () => {
  const res = await request(app)
    .get('/api/users/current-user')
    .send() // why send ?? try without ??
    .expect(200);

  expect(res.body.currentUser).toEqual(null);
});
