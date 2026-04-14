// src/app/core/models/roadmap.model.ts
export interface RoadmapWeek {
    id: string;
    userId: string;
    phase: string;
    weekLabel: string;
    title: string;
    description: string;
    hours: number;
    hasMock: boolean;
    color: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateRoadmapWeek {
    phase: string;
    weekLabel: string;
    title: string;
    description: string;
    hours: number;
    hasMock: boolean;
    color: string;
    order: number;
}

export interface UpdateRoadmapWeek extends Partial<CreateRoadmapWeek> {
    id: string;
}