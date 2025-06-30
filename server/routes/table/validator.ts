import { body } from 'express-validator';

export const createTableValidator = [
    body('capacity')
        .isNumeric()
        .withMessage('Количество мест должно быть число')
        .custom((value) => value > 0)
        .withMessage('Количество мест должно быть больше 0'),
];