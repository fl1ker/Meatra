import { body } from 'express-validator';

export const createTableValidator = [
    body('capacity')
        .isNumeric()
        .withMessage('Capacity must be a number')
        .custom((value) => value > 0)
        .withMessage('Capacity must be greater than 0'),
];