import express from 'express';
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import { currentUser, errorMiddleware, NotFoundError } from '@irickmcrs/common';
import { indexRouter } from './routes';
import { showRouter } from './routes/show';
import { newRouter } from './routes/new';
import { deleteRouter } from './routes/delete';

const app = express();

app.use(json());
app.set('trust proxy', true); // for proxy of ingress ngnix to support https

app.use(currentUser); // for kubernetes
app.use(indexRouter);
app.use(showRouter);
app.use(newRouter);
app.use(deleteRouter);

// if user sends request to not existing route
app.all('*', async () => {
  throw new NotFoundError();
});

// middleware for catching errors
app.use(errorMiddleware);

export { app };
