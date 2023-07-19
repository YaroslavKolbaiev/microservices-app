import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import mongoose from 'mongoose';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorMiddleware } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found';

const MONGO_URL =
  'mongodb+srv://iRick:nnrVi69PSk47dpRE@cluster0.349ywek.mongodb.net/microservices?retryWrites=true&w=majority';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
// if user sends request to not existing route
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

const start = async () => {
  try {
    // await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); with kuberneties
    await mongoose.connect(MONGO_URL); // with mongo Atlas
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};
start();
