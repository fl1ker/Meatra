import { body, param } from 'express-validator';

export const createReservationValidator = [
    body('name').isString().notEmpty().withMessage('Требуется имя'),
    body('phone').isString().notEmpty().withMessage('Требуется телефон'),
    body('date')
        .isISO8601()
        .toDate()
        .withMessage('Требуется действительная дата: yyyy-MM-dd')
        .custom((date) => {
            const now = new Date();
            const inputDate = new Date(date);
            // Устанавливаем начало дня для сравнения (00:00:00)
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (inputDate < today) {
                throw new Error('Дата не должна быть в прошлом');
            }
            return true;
        }),
    body('time_start')
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Время начала должно быть в формате HH:mm')
        .custom((time, { req }) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            const date = new Date(req.body.date);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
            const minHour = 11; // Restaurant opens at 11:00
            const maxHour = isFridayOrSaturday ? 25 : 23; // 25 for 01:00 next day on Fri/Sat, 23 otherwise
            if (hours < minHour || hours > maxHour || (hours === maxHour && minutes > 0)) {
                throw new Error(
                    `Бронирование возможно с 11:00 до ${isFridayOrSaturday ? '01:00' : '23:00'}`
                );
            }
            // Check if time_start is in the future
            date.setHours(hours, minutes, 0, 0);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (date < now && date.getTime() !== today.getTime()) {
                throw new Error('Время начала должно быть в будущем');
            }
            if (date.getTime() === today.getTime() && date < now) {
                throw new Error('Время начала должно быть позже текущего времени');
            }
            return true;
        }),
    body('time_end')
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Время окончания должно быть в формате HH:mm')
        .custom((time, { req }) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            const date = new Date(req.body.date);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
            const minHour = 11; // Restaurant opens at 11:00
            const maxHour = isFridayOrSaturday ? 25 : 23; // 25 for 01:00 next day on Fri/Sat, 23 otherwise
            if (hours < minHour || hours > maxHour || (hours === maxHour && minutes > 0)) {
                throw new Error(
                    `Бронирование возможно с 11:00 до ${isFridayOrSaturday ? '01:00' : '23:00'}`
                );
            }
            // Check time_end is after time_start
            const timeStart = req.body.time_start;
            if (!timeStart) {
                throw new Error('Для сравнения требуется время начала');
            }
            const [startHours, startMinutes] = timeStart.split(':').map(Number);
            const startTime = startHours * 60 + startMinutes;
            const endTime = hours * 60 + minutes;
            if (endTime <= startTime) {
                throw new Error('Время окончания должно быть после времени начала');
            }
            return true;
        }),
    body('tableId').isNumeric().withMessage('Идентификатор таблицы должен быть числом'),
];

export const updateReservationValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор брони должен быть числом'),
    body('name')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Имя не может быть пустым'),
    body('phone')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Телефон не может быть пустым'),
    body('date')
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
    body('time_start')
        .optional()
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Время начала должно быть в формате HH:mm')
        .custom((time, { req }) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            const date = new Date(req.body.date || new Date());
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
            const minHour = 11; // Restaurant opens at 11:00
            const maxHour = isFridayOrSaturday ? 25 : 23; // 25 for 01:00 next day on Fri/Sat, 23 otherwise
            if (hours < minHour || hours > maxHour || (hours === maxHour && minutes > 0)) {
                throw new Error(
                    `Бронирование возможно с 11:00 до ${isFridayOrSaturday ? '01:00' : '23:00'}`
                );
            }
            // Check if time_start is in the future
            date.setHours(hours, minutes, 0, 0);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (date < now && date.getTime() !== today.getTime()) {
                throw new Error('Время начала должно быть в будущем');
            }
            if (date.getTime() === today.getTime() && date < now) {
                throw new Error('Время начала должно быть позже текущего времени');
            }
            return true;
        }),
    body('time_end')
        .optional()
        .matches(/^\d{2}:\d{2}$/)
        .withMessage('Время окончания должно быть в формате HH:mm')
        .custom((time, { req }) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            const date = new Date(req.body.date || new Date());
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
            const minHour = 11; // Restaurant opens at 11:00
            const maxHour = isFridayOrSaturday ? 25 : 23; // 25 for 01:00 next day on Fri/Sat, 23 otherwise
            if (hours < minHour || hours > maxHour || (hours === maxHour && minutes > 0)) {
                throw new Error(
                    `Бронирование возможно с 11:00 до ${isFridayOrSaturday ? '01:00' : '23:00'}`
                );
            }
            // Check time_end is after time_start
            const timeStart = req.body.time_start || req.body.existingTimeStart;
            if (!timeStart) {
                throw new Error('Для сравнения требуется время начала');
            }
            const [startHours, startMinutes] = timeStart.split(':').map(Number);
            const startTime = startHours * 60 + startMinutes;
            const endTime = hours * 60 + minutes;
            if (endTime <= startTime) {
                throw new Error('Время окончания должно быть после времени начала');
            }
            return true;
        }),
    body('tableId')
        .optional()
        .isNumeric()
        .withMessage('Идентификатор таблицы должен быть числом'),
];

export const deleteReservationValidator = [
    param('id')
        .isNumeric()
        .withMessage('Идентификатор брони должен быть числом'),
];