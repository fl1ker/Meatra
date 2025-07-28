import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            res.status(401).json({ error: 'Недействительные учетные данные' });
            return;
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Недействительные учетные данные' });
            return;
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error(error);
        next(error);
    }
};