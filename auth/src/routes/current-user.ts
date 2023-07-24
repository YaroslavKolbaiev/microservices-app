import express from 'express';
import { currentUser } from '../middlewares/current-user';

export const currentUserRouter = express.Router();

currentUserRouter.get('/api/users/current-user', currentUser, (req, res) => {
  // if user has valid jwt tokken, middleware currentUser difines req.currentUser value of payload
  // and router than sends response an object with key-current user and value of req.currentUser(wich is actually payload)
  // otherwise response is null
  res.send({ currentUser: req.currentUser || null });
});
