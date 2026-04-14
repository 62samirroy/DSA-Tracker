// backend/src/index.ts
import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import authRoutes from './routes/auth.routes';
import logsRoutes from './routes/logs.routes';
import mocksRoutes from './routes/mocks.routes';
import contestsRoutes from './routes/contests.routes';
import roadmapRoutes from './routes/roadmap.routes';
import practiceRoutes from './routes/ai-plan.routes';
import aiPlanRoutes from './routes/ai-plan.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
    'http://localhost:4200',
    'https://dsa-tracker-five-swart.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://dsa-tracker-five-swart.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/mocks', mocksRoutes);
app.use('/api/contests', contestsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/ai-plan', aiPlanRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ PostgreSQL connected successfully!');
        console.log("DATABASE_URL =", process.env.DATABASE_URL);
        console.log("DB_HOST =", process.env.DB_HOST);
    } catch (error) {
        console.error('❌ DB connection failed:', error);
    }

    // 🔥 Always start server (VERY IMPORTANT)
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Health check: /health`);
    });
};

startServer();