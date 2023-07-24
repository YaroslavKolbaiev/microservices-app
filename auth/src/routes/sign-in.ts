import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequest } from '../errors/bad-request';
import { Password } from '../helpers/password';
import jwt from 'jsonwebtoken';

export const signInRouter = express.Router();

signInRouter.post(
  '/api/users/sign-in',
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

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);
