import { body } from 'express-validator';

export const loginValidator = [
    body('email')
        .isString()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 3 })
        .withMessage('Password must be at least 3 characters long'),
];