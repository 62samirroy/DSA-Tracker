// src/controllers/logs.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/data-source';
import { StudyLog } from '../entities/StudyLog';

export const getLogs = async (req: AuthRequest, res: Response) => {
    try {
        const { phase, person, limit = '50', offset = '0' } = req.query;
        const logRepository = AppDataSource.getRepository(StudyLog);

        const queryBuilder = logRepository.createQueryBuilder('log')
            .where('log.userId = :userId', { userId: req.userId });

        if (phase) {
            queryBuilder.andWhere('log.phase = :phase', { phase });
        }
        if (person) {
            queryBuilder.andWhere('log.person = :person', { person });
        }

        const [logs, total] = await queryBuilder
            .orderBy('log.date', 'DESC')
            .take(parseInt(limit as string))
            .skip(parseInt(offset as string))
            .getManyAndCount();

        res.json({ logs, total });
    } catch (error) {
        console.error('Error in getLogs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

export const createLog = async (req: AuthRequest, res: Response) => {
    try {
        const logRepository = AppDataSource.getRepository(StudyLog);
        const log = logRepository.create({
            ...req.body,
            userId: req.userId,
            date: new Date(req.body.date)
        });

        const savedLog = await logRepository.save(log);
        res.status(201).json(savedLog);
    } catch (error) {
        console.error('Error in createLog:', error);
        res.status(500).json({ error: 'Failed to create log' });
    }
};

export const updateLog = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const logRepository = AppDataSource.getRepository(StudyLog);

        const log = await logRepository.findOne({
            where: { id, userId: req.userId }
        });

        if (!log) {
            return res.status(404).json({ error: 'Log not found' });
        }

        logRepository.merge(log, {
            ...req.body,
            date: req.body.date ? new Date(req.body.date) : log.date
        });

        const updatedLog = await logRepository.save(log);
        res.json(updatedLog);
    } catch (error) {
        console.error('Error in updateLog:', error);
        res.status(500).json({ error: 'Failed to update log' });
    }
};

export const deleteLog = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const logRepository = AppDataSource.getRepository(StudyLog);

        const result = await logRepository.delete({ id, userId: req.userId });

        if (result.affected === 0) {
            return res.status(404).json({ error: 'Log not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteLog:', error);
        res.status(500).json({ error: 'Failed to delete log' });
    }
};