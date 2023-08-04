import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import cookieSession from 'cookie-session'; // library for handling cookies
import cors from 'cors'; // no needed if kubernetes is used
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorMiddleware, NotFoundError } from '@irickmcrs/common';
// import cookieParser from 'cookie-parser';

const app = express();

// remove cors when using kubernetes
app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true,
  })
);

app.use(json());
// app.set('trust proxy', true); // for proxy of ingress ngnix to support https
app.use(
  cookieSession({
    signed: false, // disable encription in order to support diff. programming langs
    // secure: true, // allow only https
    // secure: process.env.NODE_ENV !== 'test', // returns true if there is not test environment
  })
);

// app.use(cookieParser());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
// if user sends request to not existing route
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorMiddleware);

export { app };
