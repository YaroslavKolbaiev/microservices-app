import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { BadRequest, validateRequest } from '@irickmcrs/common';
import { jwtHelper } from '../helpers/jwtHelper';

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

    const userJwt = jwtHelper.generateAccessToken(newUser.id, newUser.email);

    // Store it in cookie session object using installed "cookie-session" library
    req.session = {
      jwt: userJwt,
    }; // kubernetes implementation

    res
      // .cookie('token', userJwt, { httpOnly: false })
      .status(201)
      .send(newUser); // in course video was also added "withCredentials: true"
  }
);
