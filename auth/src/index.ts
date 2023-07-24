import 'dotenv/config'; // you dont need this lib if you use docker
import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session'; // library for handling cookies
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorMiddleware } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found';

const app = express();

app.use(json());
// app.set('trust proxy', true); // for proxy of ingress ngnix to support https
app.use(
  cookieSession({
    signed: false, // disable encription in order to support diff. programming langs
    // secure: true, // allow only https
  })
);

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
  // check if JWT_KEY exists in env before running code.
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined');
  }
  try {
    // await mongoose.connect('mongodb://auth-mongo-srv:27017/auth'); with kuberneties
    await mongoose.connect(process.env.MONGO_URL!); // with mongo Atlas
  } catch (error) {
    console.log(error);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};
start();
