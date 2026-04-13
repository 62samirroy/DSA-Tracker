// src/app/core/models/contest.model.ts
export interface Contest {
    id: string;
    userId: string;
    name: string;
    date: Date;
    myRank?: number;
    partnerRank?: number;
    mySolved: string;
    partnerSolved: string;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}