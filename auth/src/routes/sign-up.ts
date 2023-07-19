import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation';
import { DatabaseConnectionError } from '../errors/database-connection';
import { User } from '../models/User';
import { BadRequest } from '../errors/badRequest';

export const signUpRouter = express.Router();

signUpRouter.post(
  '/api/users/sign-up',
  // middleware
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be beetween 4 and 20 characters'),
  ], // validation implemented as midleware using express-validator package
  // midleware
  async (req: Request, res: Response) => {
    const errors = validationResult(req); // any errors coming from user request

    // if erors array is not empty we run bellow command
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) throw new BadRequest('User Already exists');

    // we use custom method "build" to create a new user
    const newUser = User.build({
      email,
      password,
    });
    await newUser.save();

    res.status(201).send(newUser);
  }
);
