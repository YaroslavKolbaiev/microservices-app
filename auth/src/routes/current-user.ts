import express from 'express';

export const currentUserRouter = express.Router();

currentUserRouter.get('/api/users/current-user', (req, res) => {
  res.send('Current user route is running...');
});
