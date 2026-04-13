// src/app/core/models/log.model.ts
export interface StudyLog {
    id: string;
    userId: string;
    person: string;
    date: Date;
    phase: string;
    topic: string;
    hours: number;
    questions: number;
    difficulty?: string;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LogFilters {
    phase?: string;
    person?: string;
}