import express from 'express';
import { jwtHelper } from '../helpers/jwtHelper';
// import { currentUser } from '@irickmcrs/common';

export const currentUserRouter = express.Router();

// current-user route is designed for checking if the user is authenticated on the client side

// add current-user middleware when using kubernetes
currentUserRouter.get(
  '/api/users/current-user',
  //  currentUser,
  (req, res) => {
    /**
     * if user has valid jwt tokken, middleware currentUser sets req.currentUser the value of payload
     * and than router sends response an object with key - current-user and value of req.currentUser(wich is actually payload)
     * otherwise response is null
     */

    // IMPLEMENTATION WITH COOKIE PARSER
    const tokken = req.headers.cookie?.split('=')[1];
    if (!tokken) {
      return res.send({ currentUser: null });
    }
    try {
      const payload = jwtHelper.validateAccessToken(tokken);
      res.send({ currentUser: payload });
    } catch (error) {
      return res.send({ currentUser: null });
    }
    // res.send({ currentUser: req.currentUser || null });
  }
);
