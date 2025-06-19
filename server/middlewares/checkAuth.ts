import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    console.log('👉 Auth Header:', authHeader); // 👈 ВСЕГДА видно

    if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('👉 Token before verify:', token); // 👈 ВСЕГДА видно

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log('✅ Decoded:', decoded); // 👈 если не упало
        (req as any).user = decoded;
        next();
    } catch (error) {
        console.log('❌ JWT VERIFY ERROR:', error); // 👈 если verify упал
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
