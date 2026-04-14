import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';

// Load .env file only in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Parse DATABASE_URL from Railway
const databaseUrl = process.env.DATABASE_URL;
let dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'railway',
};

// If DATABASE_URL is provided (Railway does this), use it
if (databaseUrl) {
    console.log('Using DATABASE_URL for connection');
    const url = new URL(databaseUrl);
    dbConfig = {
        host: url.hostname,
        port: parseInt(url.port || '5432'),
        username: url.username,
        password: url.password,
        database: url.pathname.slice(1),
    };
}

console.log(`Attempting to connect to database at: ${dbConfig.host}:${dbConfig.port}`);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: false, // Always false in production
    logging: process.env.NODE_ENV === 'development',
    entities: ["dist/entities/**/*.js"],
    migrations: ["dist/migrations/**/*.js"],
    subscribers: ["dist/subscribers/**/*.js"],
    ssl: {
        rejectUnauthorized: false, // Required for Railway
    },
    extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    },
});