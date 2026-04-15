import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

console.log("Using DATABASE_URL");

export const AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl,   // 🔥 ONLY THIS
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    entities: ["dist/entities/**/*.js"],
    migrations: ["dist/migrations/**/*.js"],
    ssl: {
        rejectUnauthorized: false,
    },
});