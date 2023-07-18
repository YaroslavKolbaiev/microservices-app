import express from 'express';

export const signOutRouter = express.Router();

signOutRouter.get('/api/users/sign-out', (req, res) => {
  res.send('Sign-out route is running...');
});
