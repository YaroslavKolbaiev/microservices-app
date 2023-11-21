import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { validateRequest, BadRequest } from '@irickmcrs/common';
import { Password } from '../helpers/password';
import { jwtHelper } from '../helpers/jwtHelper';

export const signInRouter = express.Router();

signInRouter.post(
  '/api-service/users/sign-in',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadRequest('User Does not exist');

    const isValidPassword = await Password.compare(
      existingUser.password,
      password
    );

    if (!isValidPassword) throw new BadRequest('Password is not correct');

    const userJwt = jwtHelper.generateAccessToken(
      existingUser.id,
      existingUser.email
    );

    res
      .cookie('token', userJwt, { httpOnly: true })
      .status(200)
      .send(existingUser);
  }
);
