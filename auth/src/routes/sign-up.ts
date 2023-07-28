import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { BadRequest } from '../errors/bad-request';
import { validateRequest } from '../middlewares/validate-request';

export const signUpRouter = express.Router();

signUpRouter.post(
  '/api/users/sign-up',
  // middleware for email and password validation
  // validation implemented as midleware using express-validator package
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be beetween 4 and 20 characters'),
  ],
  // middleware for request.
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) throw new BadRequest('User Already exists');

    // we use custom method "build" to create a new user
    const newUser = User.build({
      email,
      password,
    });
    await newUser.save();

    // Generate JWT

    const userJwt = jwt.sign(
      { id: newUser.id, email: newUser.email },
      // i added explanation mark in order to tell type script
      // that JWT_KEY is defined in index.ts file
      process.env.JWT_KEY!
    );

    // Store it in cookie session object using installed "cookie-session" library
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(newUser);
  }
);
