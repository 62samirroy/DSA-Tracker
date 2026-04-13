import { AppDataSource } from "./config/data-source";
import { StudyLog } from "./entities/StudyLog";

export const initializeDB = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("Database connected!");
    }
};

export const db = {
    studyLog: AppDataSource.getRepository(StudyLog),
};

export default db;