import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import menuRoutes from './routes/menu';
import express from 'express';
import tableRoutes from './routes/table';
import reservationRoutes from './routes/reservation';
import authRoutes from './routes/auth';
import prisma from "./prisma";

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
    res.send('Restaurant API is running 🚀');
});

const PORT = 3000;

// Обёртка с try/catch
const startServer = async () => {
    try {
        // Проверим подключение к БД
        await prisma.$connect();
        console.log('✅ Connected to database');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();