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
    process.env.FRONTEND_URL, // Production frontend
    "http://localhost:3000",
    "http://localhost:5173",
];

// Configure CORS
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., Postman, mobile apps)
            if (!origin) return callback(null, true);

            // Allow predefined origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow all Vercel preview deployments
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            console.log(`Blocked origin: ${origin}`);
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional but helpful)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
        databaseHost: process.env.DB_HOST || 'from_url'
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
    let retries = 5;
    let connected = false;

    while (retries > 0 && !connected) {
        try {
            await AppDataSource.initialize();
            console.log('✅ PostgreSQL connected successfully!');
            console.log(`📊 Database: ${AppDataSource.options.database}`);
            // console.log(`🔗 Host: ${AppDataSource.options.host}:${AppDataSource.options.port}`);
            connected = true;
        } catch (error) {
            console.error(`❌ DB connection failed (${retries} attempts left):`, error.message);
            retries--;
            if (retries > 0) {
                console.log('Waiting 5 seconds before retry...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('❌ Failed to connect to database after multiple attempts');
                // Don't throw error, just log it - server will still start
            }
        }
    }

    // 🔥 Always start server (VERY IMPORTANT)
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Health check: /health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server');
        server.close(async () => {
            console.log('HTTP server closed');
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                console.log('Database connection closed');
            }
            process.exit(0);
        });
    });
};

startServer();