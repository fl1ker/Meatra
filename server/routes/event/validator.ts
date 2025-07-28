import { body, param } from 'express-validator';

export const createEventValidator = [
    body('title')
        .isString()
        .notEmpty()
        .withMessage('Название мероприятия обязательно')
        .isLength({ min: 2, max: 100 })
        .withMessage('Название должно быть от 2 до 100 символов'),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('Описание мероприятия обязательно')
        .isLength({ max: 1000 })
        .withMessage('Описание не должно превышать 1000 символов'),
];

export const updateEventValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор мероприятия должен быть числом'),
    body('title')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Название не может быть пустым')
        .isLength({ min: 2, max: 100 })
        .withMessage('Название должно быть от 2 до 100 символов'),
    body('description')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Описание не может быть пустым')
        .isLength({ max: 1000 })
        .withMessage('Описание не должно превышать 1000 символов'),

];

export const deleteEventValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор мероприятия должен быть числом'),
];