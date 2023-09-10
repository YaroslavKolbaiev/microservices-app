import 'dotenv/config'; // you dont need this lib if you use docker
import mongoose from 'mongoose';
import { app } from './app';

// when using localy
const PORT = 3000;

const start = async () => {
  // check if JWT_KEY exists in env before running code.
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  if (!process.env.mongoUrl) {
    throw new Error('MONGO_URL must be defined');
  }
  try {
    // await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); with kuberneties
    await mongoose.connect(process.env.mongoUrl!); // with mongo Atlas
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    /** for cubernetes must be same port */
    console.log('Listening on port:', PORT);
  });
};
start();
