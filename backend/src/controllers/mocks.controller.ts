// src/controllers/mocks.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/data-source';
import { MockSession } from '../entities/MockSession';

export const getMocks = async (req: AuthRequest, res: Response) => {
    try {
        const mockRepository = AppDataSource.getRepository(MockSession);
        const mocks = await mockRepository.find({
            where: { userId: req.userId },
            order: { date: 'DESC' }
        });
        res.json(mocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch mock sessions' });
    }
};

export const createMock = async (req: AuthRequest, res: Response) => {
    try {
        const mockRepository = AppDataSource.getRepository(MockSession);
        const mock = mockRepository.create({
            ...req.body,
            userId: req.userId,
            date: new Date(req.body.date)
        });

        const savedMock = await mockRepository.save(mock);
        res.status(201).json(savedMock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create mock session' });
    }
};

export const updateMock = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const mockRepository = AppDataSource.getRepository(MockSession);

        const mock = await mockRepository.findOne({
            where: { id, userId: req.userId }
        });

        if (!mock) {
            return res.status(404).json({ error: 'Mock session not found' });
        }

        mockRepository.merge(mock, {
            ...req.body,
            date: req.body.date ? new Date(req.body.date) : mock.date
        });

        const updatedMock = await mockRepository.save(mock);
        res.json(updatedMock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update mock session' });
    }
};

export const deleteMock = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id as string;
        const mockRepository = AppDataSource.getRepository(MockSession);

        const result = await mockRepository.delete({ id, userId: req.userId });

        if (result.affected === 0) {
            return res.status(404).json({ error: 'Mock session not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete mock session' });
    }
};