import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// we declare new global var
declare global {
  var signup: () => string[]; // signin is function return Promise and promise returns array of strings
}

// setup file for jest. configuration for fake database.

// let mongo: any;

// // hook function. runs before all of our tests.
// beforeAll(async () => {
//   // process.env.JWT_KEY = 'asdasf';
//   // mongo = await MongoMemoryServer.create();
//   // const mongoUri = mongo.getUri();

//   // await mongoose.connect(mongoUri, {});

//   console.log('before all');
// });

// beforeEach(async () => {
//   // find all existing collections
//   // const collections = await mongoose.connection.db.collections();

//   // // reset all data before each test that we run
//   // for (let collection of collections) {
//   //   await collection.deleteMany({});
//   // }

//   console.log('before each');
// });

// afterAll(async () => {
//   // if (mongo) {
//   //   await mongo.stop();
//   // }
//   // await mongoose.connection.close();

//   console.log('after all');
// });

global.signup = () => {
  // Build a JWT payload. {id, email}

  const payload = {
    email: 'any-email@test.com',
    id: new mongoose.Types.ObjectId().toHexString(), // randomly generate new id for each function call
  };

  // create the JWT

  const token = jwt.sign(payload, 'secret-key');

  // build session Object. {jwt: MY_JWT}

  const session = { jwt: token };

  // Turn session in JSON

  const sessionJSON = JSON.stringify(session);

  // Take JSON and decode it ass base64

  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string with the cookie with encoded data

  return [`session=${base64}`];
};
