import 'dotenv/config'; // you dont need this lib if you use docker
import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // check if JWT_KEY exists in env before running code.
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  try {
    // await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); with kuberneties
    // await mongoose.connect(process.env.MONGO_URL!); // with mongo Atlas
    console.log('I will run mongo here...');
  } catch (error) {
    console.log(error);
  }
  app.listen(3002, () => {
    console.log('Listening on port 3000');
  });
};
start();
