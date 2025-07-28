import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CreateJobApplicationRequest, CreateJobPositionRequest } from '../../types/job';

// Получить все доступные позиции
export const getJobPositions = async (req: Request, res: Response): Promise<void> => {
    try {
        const positions = await prisma.jobPosition.findMany();
        res.json(positions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить все заявления на работу (для админа)
export const getJobApplications = async (req: Request, res: Response): Promise<void> => {
    try {
        const applications = await prisma.jobApplication.findMany({
            include: {
                position: true, // Включаем информацию о должности
            },
        });
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать заявление на работу
export const createJobApplication = async (
    req: Request<{}, {}, CreateJobApplicationRequest>,
    res: Response
): Promise<void> => {
    try {
        const { fullName, phone, positionId, experience } = req.body;

        // Проверка существования позиции
        const position = await prisma.jobPosition.findUnique({
            where: { id: Number(positionId) },
        });
        if (!position) {
            res.status(400).json({ error: 'Позиция не существует' });
            return;
        }

        const application = await prisma.jobApplication.create({
            data: {
                fullName,
                phone,
                positionId: Number(positionId),
                experience,
            },
        });

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Создать новую вакансию
export const createJobPosition = async (
    req: Request<{}, {}, CreateJobPositionRequest>,
    res: Response
): Promise<void> => {
    try {
        const { name, description } = req.body;

        // Проверка уникальности названия вакансии
        const existingPosition = await prisma.jobPosition.findUnique({
            where: { name },
        });
        if (existingPosition) {
            res.status(400).json({ error: 'Вакансия с таким названием уже существует' });
            return;
        }

        const position = await prisma.jobPosition.create({
            data: {
                name,
                description,
            },
        });

        res.status(201).json(position);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};