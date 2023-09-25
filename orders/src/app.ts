import express from 'express';
// import 'dotenv/config'; // for testing !!! remember!!!!
import 'express-async-errors'; // for handling async errors
import { json } from 'body-parser';
import cookieSession from 'cookie-session'; // library for handling cookies
// import cors from 'cors'; // no needed if kubernetes is used
import { currentUser, errorMiddleware, NotFoundError } from '@irickmcrs/common';
import { indexRouter } from './routes';
import { showRouter } from './routes/show';
import { newRouter } from './routes/new';
import { deleteRouter } from './routes/delete';
import { authMiddleware } from './middleware_test/current-user';

const app = express();

// remove cors when using kubernetes
// app.use(
//   cors({
//     origin: 'http://localhost:3001',
//     credentials: true,
//   })
// );

app.use(json());
// app.set('trust proxy', true); // for proxy of ingress ngnix to support https
app.use(
  cookieSession({
    signed: false, // disable encription in order to support diff. programming langs
    // secure: true, // allow only https
    secure: process.env.NODE_ENV !== 'test', // returns true if there is not test environment
  })
);

// app.use(currentUser); // for kubernetes
app.use(authMiddleware); // for local implementaion
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
