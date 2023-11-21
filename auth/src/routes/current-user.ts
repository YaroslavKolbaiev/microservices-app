import express from 'express';
import { currentUser } from '@irickmcrs/common';

export const currentUserRouter = express.Router();

currentUserRouter.get(
  '/api-service/users/current-user',
  currentUser,
  (req, res) => {
    /**
     * if user has valid jwt tokken, middleware currentUser sets req.currentUser the value of payload
     * and than router sends response an object with key - current-user and value of req.currentUser(wich is actually payload)
     * otherwise response is null
     */

    res.send({ currentUser: req.currentUser || null });
  }
);
