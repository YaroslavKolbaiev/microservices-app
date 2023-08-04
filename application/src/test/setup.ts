import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

// we declare new global var
declare global {
  var signup: () => Promise<string[]>; // signin is function return Promise and promise returns array of strings
}

// setup file for jest. configuration for fake database.

let mongo: any;

// hook function. runs before all of our tests.
beforeAll(async () => {
  // process.env.JWT_KEY = 'asdasf';
  // mongo = await MongoMemoryServer.create();
  // const mongoUri = mongo.getUri();

  // await mongoose.connect(mongoUri, {});

  console.log('before all');
});

beforeEach(async () => {
  // find all existing collections
  // const collections = await mongoose.connection.db.collections();

  // // reset all data before each test that we run
  // for (let collection of collections) {
  //   await collection.deleteMany({});
  // }

  console.log('before each');
});

afterAll(async () => {
  // if (mongo) {
  //   await mongo.stop();
  // }
  // await mongoose.connection.close();

  console.log('after all');
});

// helper function for sign-in.
// implemented as a global for accessing without import
// you can also create a normal helper fn in separate folder

global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const res = await request(app)
    .post('/api/users/sign-up') // immitating successfull sign-up
    .send({
      email,
      password,
    }) // request body
    .expect(201);

  const cookie = res.get('Set-Cookie');

  return cookie;
};
