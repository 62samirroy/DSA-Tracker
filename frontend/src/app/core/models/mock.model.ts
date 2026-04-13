// src/app/core/models/mock.model.ts
export interface MockSession {
    id: string;
    userId: string;
    weekNum?: number;
    date: Date;
    topic: string;
    duration?: number;
    q1?: string;
    q2?: string;
    perf?: string;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}