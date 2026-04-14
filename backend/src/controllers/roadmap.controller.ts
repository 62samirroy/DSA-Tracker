// backend/src/controllers/roadmap.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/data-source';
import { RoadmapWeek } from '../entities/RoadmapWeek';

export const getRoadmap = async (req: AuthRequest, res: Response) => {
    try {
        const { phase } = req.query;
        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);

        const where: any = { userId: req.userId };
        if (phase) where.phase = phase;

        const roadmap = await roadmapRepository.find({
            where,
            order: { order: 'ASC' }
        });

        res.json(roadmap);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch roadmap' });
    }
};

export const getRoadmapById = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);

        const week = await roadmapRepository.findOne({
            where: { id, userId: req.userId }
        });

        if (!week) {
            return res.status(404).json({ error: 'Week not found' });
        }

        res.json(week);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch week' });
    }
};

export const createWeek = async (req: AuthRequest, res: Response) => {
    try {
        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);
        const week = roadmapRepository.create({
            ...req.body,
            userId: req.userId
        });

        const savedWeek = await roadmapRepository.save(week);
        res.status(201).json(savedWeek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create week' });
    }
};

export const updateWeek = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);

        const week = await roadmapRepository.findOne({
            where: { id, userId: req.userId }
        });

        if (!week) {
            return res.status(404).json({ error: 'Week not found' });
        }

        roadmapRepository.merge(week, req.body);
        const updatedWeek = await roadmapRepository.save(week);
        res.json(updatedWeek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update week' });
    }
};

export const deleteWeek = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const roadmapRepository = AppDataSource.getRepository(RoadmapWeek);

        const result = await roadmapRepository.delete({ id, userId: req.userId });

        if (result.affected === 0) {
            return res.status(404).json({ error: 'Week not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete week' });
    }
};