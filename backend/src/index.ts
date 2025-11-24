import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import authRoutes from './routes/auth';
import notificationRoutes from './routes/notifications';
import pollRoutes from './routes/polls';
import userRoutes from './routes/users';

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/polls', pollRoutes);
app.use('/users', userRoutes);
app.use('/notifications', notificationRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Vunes Poll API is running',
        version: '1.0.0',
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://192.168.0.178:${PORT}`);
});

export default app;
