// backend/src/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { StudyLog } from "../entities/StudyLog";
import { MockSession } from "../entities/MockSession";
import { Contest } from "../entities/Contest";
import { RoadmapWeek } from "../entities/RoadmapWeek";
import { PracticeSession } from "../entities/PracticeSession";
import { QuestionCheck } from "../entities/QuestionCheck";
import { PracticePlan } from "../entities/PracticePlan";
import { PracticeTask } from "../entities/PracticeTask";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/migrations/*.js"],
    synchronize: false,
});