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
import aiPlanRoutes from "./routes/ai-plan.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS properly
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/mocks', mocksRoutes);
app.use('/api/contests', contestsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/ai-plan', aiPlanRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log('✅ PostgreSQL connected successfully!');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
        });
    })
    .catch((error) => {
        console.error('❌ Error connecting to PostgreSQL:', error);
        process.exit(1);
    });