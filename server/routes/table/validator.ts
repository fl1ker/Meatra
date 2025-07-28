import { body, param, query } from 'express-validator';

export const createTableValidator = [
    body('capacity')
        .isNumeric()
        .withMessage('Количество мест должно быть число')
        .custom((value) => value > 0)
        .withMessage('Количество мест должно быть больше 0'),
];

export const updateTableValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор стола должен быть числом'),
    body('capacity')
        .optional()
        .isNumeric()
        .withMessage('Количество мест должно быть число')
        .custom((value) => value > 0)
        .withMessage('Количество мест должно быть больше 0'),
];

export const deleteTableValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор стола должен быть числом'),
];

export const getTablesValidator = [
    query('date')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Требуется действительная дата: yyyy-MM-dd')
        .custom((date) => {
            const now = new Date();
            const inputDate = new Date(date);
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (inputDate < today) {
                throw new Error('Дата не должна быть в прошлом');
            }
            return true;
        }),
    query('time')
        .optional()
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Время должно быть в формате HH:mm')
        .custom((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            return true;
        })
        .custom((time, { req }) => {
            if (time && (!req.query || !req.query.date)) {
                throw new Error('Для указания времени требуется указать дату');
            }
            return true;
        }),
];