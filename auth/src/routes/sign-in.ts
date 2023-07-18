import express from 'express';

export const signInRouter = express.Router();

signInRouter.get('/api/users/sign-in', (req, res) => {
  res.send('Sign-in route is running...');
});
