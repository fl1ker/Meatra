import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateReservationRequest, UpdateReservationRequest } from '../../types/reservation';

// Получить все брони
export const getReservations = async (req: Request, res: Response): Promise<void> => {
    try {
        const reservations = await prisma.reservation.findMany({
            include: { table: true },
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать бронь
export const createReservation = async (
    req: Request<{}, {}, CreateReservationRequest>,
    res: Response
): Promise<void> => {
    try {
        const { name, phone, date, time_start, time_end, tableId } = req.body;

        // Проверка существования стола
        const table = await prisma.table.findUnique({
            where: { id: Number(tableId) },
        });
        if (!table) {
            res.status(400).json({ error: 'Стол не существует' });
            return;
        }

        // Проверка конфликта
        const conflict = await prisma.reservation.findFirst({
            where: {
                tableId: Number(tableId),
                date: new Date(date),
                OR: [
                    {
                        AND: [
                            { time_start: { lte: time_end } },
                            { time_end: { gt: time_start } },
                        ],
                    },
                ],
            },
        });

        if (conflict) {
            res.status(400).json({ error: 'Стол уже занят на это время' });
            return;
        }

        const reservation = await prisma.reservation.create({
            data: {
                name,
                phone,
                date: new Date(date),
                time_start,
                time_end,
                tableId: Number(tableId),
            },
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить бронь
export const updateReservation = async (
    req: Request<{ id: string }, {}, UpdateReservationRequest>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, phone, date, time_start, time_end, tableId } = req.body;

        // Проверка существования брони
        const existingReservation = await prisma.reservation.findUnique({
            where: { id: Number(id) },
        });
        if (!existingReservation) {
            res.status(404).json({ error: 'Бронь не найдена' });
            return;
        }

        // Проверка существования стола, если tableId передан
        if (tableId) {
            const table = await prisma.table.findUnique({
                where: { id: Number(tableId) },
            });
            if (!table) {
                res.status(400).json({ error: 'Стол не существует' });
                return;
            }
        }

        // Проверка конфликта, если изменяются дата, время или стол
        if (date || time_start || time_end || tableId) {
            const checkDate = date ? new Date(date) : existingReservation.date;
            const checkTimeStart = time_start || existingReservation.time_start;
            const checkTimeEnd = time_end || existingReservation.time_end;
            const checkTableId = tableId ? Number(tableId) : existingReservation.tableId;

            const conflict = await prisma.reservation.findFirst({
                where: {
                    id: { not: Number(id) }, // Исключаем текущую бронь
                    tableId: checkTableId,
                    date: checkDate,
                    OR: [
                        {
                            AND: [
                                { time_start: { lte: checkTimeEnd } },
                                { time_end: { gt: checkTimeStart } },
                            ],
                        },
                    ],
                },
            });

            if (conflict) {
                res.status(400).json({ error: 'Стол уже занят на это время' });
                return;
            }
        }

        const reservation = await prisma.reservation.update({
            where: { id: Number(id) },
            data: {
                name,
                phone,
                date: date ? new Date(date) : undefined,
                time_start,
                time_end,
                tableId: tableId ? Number(tableId) : undefined,
            },
        });

        res.json(reservation);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Бронь не найдена' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить бронь
export const deleteReservation = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.reservation.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Бронь не найдена' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};