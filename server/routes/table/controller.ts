import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateTableRequest, UpdateTableRequest } from '../../types/table';

// Получить все столы
export const getTables = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, time } = req.query;

        const tables = await prisma.table.findMany();

        // Если дата и время не указаны, возвращаем столы без проверки занятости
        if (!date || !time) {
            const result = tables.map((table) => ({
                id: table.id,
                capacity: table.capacity,
                isOccupied: null,
            }));
            res.json(result);
            return;
        }

        // Парсим дату и время
        const checkDate = new Date(date as string);
        const [hours, minutes] = (time as string).split(':').map(Number);
        const checkTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // Проверяем занятость каждого стола
        const result = await Promise.all(
            tables.map(async (table) => {
                const reservation = await prisma.reservation.findFirst({
                    where: {
                        tableId: table.id,
                        date: checkDate,
                        OR: [
                            {
                                AND: [
                                    { time_start: { lte: checkTime } },
                                    { time_end: { gt: checkTime } },
                                ],
                            },
                        ],
                    },
                });

                return {
                    id: table.id,
                    capacity: table.capacity,
                    isOccupied: !!reservation, // true, если есть бронирование, иначе false
                };
            })
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать стол
export const createTable = async (
    req: Request<{}, {}, CreateTableRequest>,
    res: Response
): Promise<void> => {
    try {
        const { capacity } = req.body;
        const table = await prisma.table.create({
            data: {
                capacity: Number(capacity),
            },
        });
        res.status(201).json(table);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить стол
export const updateTable = async (
    req: Request<{ id: string }, {}, UpdateTableRequest>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { capacity } = req.body;
        const table = await prisma.table.update({
            where: { id: Number(id) },
            data: {
                capacity: capacity ? Number(capacity) : undefined,
            },
        });
        res.json(table);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Стол не найден' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить стол
export const deleteTable = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        // Проверка, есть ли бронирования для этого стола
        const reservations = await prisma.reservation.findFirst({
            where: { tableId: Number(id) },
        });
        if (reservations) {
            res.status(400).json({ error: 'Нельзя удалить стол с активными бронированиями' });
            return;
        }
        await prisma.table.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Стол не найден' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};