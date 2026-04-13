// src/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { StudyLog } from "../entities/StudyLog";
import { MockSession } from "../entities/MockSession";
import { Contest } from "../entities/Contest";
import { RoadmapWeek } from "../entities/RoadmapWeek";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "dsa_tracker",
    synchronize: true,
    logging: true,
    entities: [User, StudyLog, MockSession, Contest, RoadmapWeek],
    migrations: [],
    subscribers: [],
});