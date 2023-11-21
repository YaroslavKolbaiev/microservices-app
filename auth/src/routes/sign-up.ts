import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import { BadRequest, validateRequest } from '@irickmcrs/common';
import { jwtHelper } from '../helpers/jwtHelper';

export const signUpRouter = express.Router();

signUpRouter.post(
  '/api-service/users/sign-up',
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
  // express-validator if there are errors will push all errors into array
  // 'validateRequest' middleware checks if array is empty, if not it throws and error
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

    res.cookie('token', userJwt, { httpOnly: false }).status(201).send(newUser);
  }
);
