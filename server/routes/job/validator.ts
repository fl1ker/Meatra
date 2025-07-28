import { body } from 'express-validator';

export const createJobApplicationValidator = [
    body('fullName')
        .isString()
        .notEmpty()
        .withMessage('Полное имя обязательно')
        .isLength({ min: 2, max: 100 })
        .withMessage('Полное имя должно быть от 2 до 100 символов')
        .custom((value) => {
            const parts = value.trim().split(/\s+/);
            if (parts.length < 2) {
                throw new Error('Полное имя должно содержать как минимум имя и фамилию');
            }
            return true;
        }),
    body('phone')
        .isString()
        .notEmpty()
        .withMessage('Телефон обязателен')
        .matches(/^\+?\d{10,15}$/)
        .withMessage('Неверный формат телефона (10–15 цифр, может начинаться с +)'),
    body('positionId')
        .isNumeric()
        .withMessage('Идентификатор позиции должен быть числом'),
    body('experience')
        .isString()
        .notEmpty()
        .withMessage('Описание опыта обязательно')
        .isLength({ max: 1000 })
        .withMessage('Описание опыта не должно превышать 1000 символов'),
];
export const createJobPositionValidator = [
    body('name')
        .isString()
        .notEmpty()
        .withMessage('Название вакансии обязательно')
        .isLength({ min: 2, max: 100 })
        .withMessage('Название вакансии должно быть от 2 до 100 символов'),
    body('description')
        .isString()
        .notEmpty()
        .withMessage('Описание вакансии обязательно')
        .isLength({ max: 1000 })
        .withMessage('Описание вакансии не должно превышать 1000 символов'),
];