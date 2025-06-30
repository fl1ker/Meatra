import { Request, Response } from 'express';
import prisma from '../../prisma';

// --- Меню ---

// Создать меню
export const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const menu = await prisma.menu.create({
            data: { name },
        });
        res.status(201).json(menu);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Меню с таким именем уже существует' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить все меню
export const getMenus = async (req: Request, res: Response): Promise<void> => {
    try {
        const menus = await prisma.menu.findMany({
            include: { categories: { include: { category: true } } },
        });
        res.json(menus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить меню
export const updateMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const menu = await prisma.menu.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.json(menu);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Меню не найдено' });
            return;
        }
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Меню с таким именем уже существует' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить меню
export const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.menu.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Меню не найдено' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// --- Категории ---

// Создать категорию
export const createMenuCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const category = await prisma.menuCategory.create({
            data: { name },
        });
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить все категории
export const getMenuCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.menuCategory.findMany({
            include: { menus: { include: { menu: true } }, items: true },
        });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить категорию
export const updateMenuCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await prisma.menuCategory.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.json(category);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Категория не найдена' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить категорию
export const deleteMenuCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.menuCategory.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Категория не найдена' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Назначить категорию меню
export const assignCategoryToMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { menuId, categoryId } = req.body;
        // Проверка существования меню и категории
        const menu = await prisma.menu.findUnique({ where: { id: Number(menuId) } });
        const category = await prisma.menuCategory.findUnique({ where: { id: Number(categoryId) } });
        if (!menu || !category) {
            res.status(400).json({ error: 'Меню или категория не найдены' });
            return;
        }
        const assignment = await prisma.menuCategoryAssignment.create({
            data: {
                menuId: Number(menuId),
                categoryId: Number(categoryId),
            },
        });
        res.status(201).json(assignment);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(400).json({ error: 'Категория уже назначена этому меню' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// --- Блюда ---

// Создать блюдо
export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, categoryId } = req.body;
        // Проверка существования категории
        const category = await prisma.menuCategory.findUnique({
            where: { id: Number(categoryId) },
        });
        if (!category) {
            res.status(400).json({ error: 'Категория не существует' });
            return;
        }
        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price,
                categoryId: Number(categoryId),
            },
        });
        res.status(201).json(menuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Получить все блюда
export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const menuItems = await prisma.menuItem.findMany({
            include: { category: true },
        });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Обновить блюдо
export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId } = req.body;
        // Проверка существования категории, если categoryId передан
        if (categoryId) {
            const category = await prisma.menuCategory.findUnique({
                where: { id: Number(categoryId) },
            });
            if (!category) {
                res.status(400).json({ error: 'Категория не существует' });
                return;
            }
        }
        const menuItem = await prisma.menuItem.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price,
                categoryId: categoryId ? Number(categoryId) : undefined,
            },
        });
        res.json(menuItem);
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Блюдо не найдено' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// Удалить блюдо
export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Блюдо не найдено' });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};