import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/sign-in';
import { signOutRouter } from './routes/sign-out';
import { signUpRouter } from './routes/sign-up';
import { errorMiddleware, NotFoundError } from '@irickmcrs/common';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());

app.use(json());

app.set('trust proxy', true); // for proxy of ingress ngnix to support https

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

// middleware for catching errors
app.use(errorMiddleware);

export { app };
