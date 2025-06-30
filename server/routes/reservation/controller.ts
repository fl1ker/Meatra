import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateReservationRequest } from '../../types/reservation';

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