import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  if (!process.env.mongoUrl) {
    throw new Error('MONGO_URL must be defined');
  }
  try {
    await mongoose.connect(process.env.mongoUrl!);
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    console.log('Listening on port:', PORT);
  });
};
start();
