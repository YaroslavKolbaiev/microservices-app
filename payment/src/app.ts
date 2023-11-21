import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import { currentUser, errorMiddleware, NotFoundError } from '@irickmcrs/common';
import { createChargeRouter } from './routes/new';
import { successRouter } from './routes/success';

const app = express();

app.use(json());
app.set('trust proxy', true); // for proxy of ingress ngnix to support https

app.use(currentUser);
app.use(createChargeRouter);
app.use(successRouter);

// if user sends request to not existing route
app.all('*', async () => {
  throw new NotFoundError();
});

// middleware for catching errors
app.use(errorMiddleware);

export { app };
