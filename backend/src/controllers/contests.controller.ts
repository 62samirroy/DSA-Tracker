// src/controllers/contests.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/data-source';
import { Contest } from '../entities/Contest';

export const getContests = async (req: AuthRequest, res: Response) => {
    try {
        const contestRepository = AppDataSource.getRepository(Contest);
        const contests = await contestRepository.find({
            where: { userId: req.userId },
            order: { date: 'DESC' }
        });
        res.json(contests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch contests' });
    }
};

export const createContest = async (req: AuthRequest, res: Response) => {
    try {
        const contestRepository = AppDataSource.getRepository(Contest);
        const contest = contestRepository.create({
            ...req.body,
            userId: req.userId,
            date: new Date(req.body.date)
        });

        const savedContest = await contestRepository.save(contest);
        res.status(201).json(savedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create contest' });
    }
};

export const updateContest = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const contestRepository = AppDataSource.getRepository(Contest);

        const contest = await contestRepository.findOne({
            where: { id, userId: req.userId }
        });

        if (!contest) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        contestRepository.merge(contest, {
            ...req.body,
            date: req.body.date ? new Date(req.body.date) : contest.date
        });

        const updatedContest = await contestRepository.save(contest);
        res.json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update contest' });
    }
};

export const deleteContest = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const contestRepository = AppDataSource.getRepository(Contest);

        const result = await contestRepository.delete({ id, userId: req.userId });

        if (result.affected === 0) {
            return res.status(404).json({ error: 'Contest not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete contest' });
    }
};