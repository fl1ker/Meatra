import { body } from 'express-validator';

export const createReservationValidator = [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('phone').isString().notEmpty().withMessage('Phone is required'),
    body('date').isISO8601().toDate().withMessage('A valid date is required'),
    body('time_start').matches(/^\d{2}:\d{2}$/).withMessage('Time start must be in HH:mm format'),
    body('time_end').matches(/^\d{2}:\d{2}$/).withMessage('Time end must be in HH:mm format'),
    body('tableId').isNumeric().withMessage('Table ID must be a number'),
];