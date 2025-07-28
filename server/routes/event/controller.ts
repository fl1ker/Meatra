import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateEventRequest, UpdateEventRequest } from '../../types/events';
import fs from 'fs/promises';
import path from 'path';

// Получить все мероприятия
export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await prisma.event.findMany();
        res.json(events);
    } catch (error) {
        console.error('Ошибка при получении мероприятий:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать мероприятие
export const createEvent = async (
    req: Request<{}, {}, CreateEventRequest>,
    res: Response
): Promise<void> => {
    try {
        const { title, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const event = await prisma.event.create({
            data: {
                title,
                description,
                image,
            },
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Ошибка при создании мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить мероприятие
export const updateEvent = async (
    req: Request<{ id: string }, {}, UpdateEventRequest>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        // Получаем текущее мероприятие для проверки старого изображения
        const existingEvent = await prisma.event.findUnique({
            where: { id: Number(id) },
        });

        if (!existingEvent) {
            res.status(404).json({ error: 'Мероприятие не найдено' });
            return;
        }

        // Если загружено новое изображение, удаляем старое
        if (image && existingEvent.image) {
            try {
                await fs.unlink(path.join(__dirname, '../../..', existingEvent.image));
            } catch (error) {
                console.warn('Не удалось удалить старое изображение:', error);
            }
        }

        const event = await prisma.event.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                image,
            },
        });

        res.json(event);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Мероприятие не найдено' });
            return;
        }
        console.error('Ошибка при обновлении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить мероприятие
export const deleteEvent = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Получаем мероприятие для проверки изображения
        const existingEvent = await prisma.event.findUnique({
            where: { id: Number(id) },
        });

        if (!existingEvent) {
            res.status(404).json({ error: 'Мероприятие не найдено' });
            return;
        }

        // Удаляем изображение, если оно существует
        if (existingEvent.image) {
            try {
                await fs.unlink(path.join(__dirname, '../../..', existingEvent.image));
            } catch (error) {
                console.warn('Не удалось удалить изображение:', error);
            }
        }

        await prisma.event.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Мероприятие не найдено' });
            return;
        }
        console.error('Ошибка при удалении мероприятия:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};