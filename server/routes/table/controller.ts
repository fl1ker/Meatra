import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateTableRequest } from '../../types/table';

// Получить все столы
export const getTables = async (req: Request, res: Response): Promise<void> => {
    try {
        const tables = await prisma.table.findMany();
        res.json(tables);
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

        if (!capacity) {
            res.status(400).json({ error: 'Количество мест обязательно' });
            return;
        }

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