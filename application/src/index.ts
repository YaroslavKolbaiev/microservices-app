import 'dotenv/config'; // you dont need this lib if you use docker
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // check if MONGO_URL and JWT exists in env before running code.
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URL); // with mongo Atlas
  } catch (error) {
    console.log(error);
  }
  app.listen(3002, () => {
    console.log('Listening on port 3002');
  });
};
start();
