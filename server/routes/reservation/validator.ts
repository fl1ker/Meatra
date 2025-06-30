import { body } from 'express-validator';

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
        .custom((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            return true;
        })
        .custom((time_start, { req }) => {
            const date = new Date(req.body.date);
            const [hours, minutes] = time_start.split(':').map(Number);
            date.setHours(hours, minutes, 0, 0); // Устанавливаем время начала
            const now = new Date();
            // Разрешаем бронирование на текущий день, если время начала в будущем
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
        .custom((time) => {
            const [hours, minutes] = time.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                throw new Error('Неверный формат времени (часы 0-23, минуты 0-59)');
            }
            return true;
        })
        .custom((time_end, { req }) => {
            const timeStart = req.body.time_start;
            if (!timeStart) {
                throw new Error('Для сравнения требуется время начала');
            }
            const [startHours, startMinutes] = timeStart.split(':').map(Number);
            const [endHours, endMinutes] = time_end.split(':').map(Number);
            const startTime = startHours * 60 + startMinutes;
            const endTime = endHours * 60 + endMinutes;
            if (endTime <= startTime) {
                throw new Error('Время окончания должно быть после времени начала');
            }
            return true;
        }),
    body('tableId').isNumeric().withMessage('Идентификатор таблицы должен быть числом'),
];