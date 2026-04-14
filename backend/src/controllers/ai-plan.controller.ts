// backend/src/controllers/ai-plan.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../config/data-source';
import { StudyLog } from '../entities/StudyLog';
import { QuestionCheck } from '../entities/QuestionCheck';
import { PracticePlan } from '../entities/PracticePlan';
import { PracticeTask } from '../entities/PracticeTask';
import { QUESTION_BANK, normalizeTopic } from '../constants/question-bank';


export const generatePlan = async (req: AuthRequest, res: Response) => {
    try {
        const studyLogRepository = AppDataSource.getRepository(StudyLog);
        const logs = await studyLogRepository.find({
            where: { userId: req.userId! },
            order: { date: 'DESC' },
            select: ['topic', 'date', 'hours', 'questions']
        });

        if (logs.length === 0) {
            return res.status(400).json({
                error: 'No study logs found. Log some sessions first to generate a plan.',
            });
        }

        const seen = new Set<string>();
        const studiedTopics: { topic: string; lastStudied: Date; totalHours: number }[] = [];

        for (const log of logs) {
            const key = normalizeTopic(log.topic);
            if (!seen.has(key) && QUESTION_BANK[key]) {
                seen.add(key);
                studiedTopics.push({ topic: key, lastStudied: log.date, totalHours: 0 });
            }
            const entry = studiedTopics.find(t => t.topic === key);
            if (entry) entry.totalHours += log.hours;
        }

        const questionRepository = AppDataSource.getRepository(QuestionCheck);
        const checks = await questionRepository.find({
            where: { userId: req.userId!, done: true },
            select: ['question']
        });
        const solvedSet = new Set(checks.map(c => c.question));

        const tasks: any[] = [];
        let dayOffset = 1;
        let order = 0;

        for (const { topic } of studiedTopics) {
            const bank = QUESTION_BANK[topic] ?? [];
            const unsolved = bank.filter(q => !solvedSet.has(q.question));

            if (unsolved.length === 0) continue;

            let dayMins = 0;
            let currentOffset = dayOffset;

            for (const q of unsolved) {
                if (dayMins + q.mins > 90) {
                    currentOffset++;
                    dayMins = 0;
                }

                const date = new Date();
                date.setDate(date.getDate() + currentOffset);
                date.setHours(0, 0, 0, 0);

                tasks.push({
                    date: date.toISOString(),
                    topic,
                    question: q.question,
                    difficulty: q.difficulty,
                    estimateMins: q.mins,
                    order: order++,
                });

                dayMins += q.mins;
            }

            dayOffset = currentOffset + 1;
        }

        res.json({ tasks, totalDays: dayOffset - 1, totalTasks: tasks.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate plan' });
    }
};

export const savePlan = async (req: AuthRequest, res: Response) => {
    try {
        const { tasks } = req.body;

        const planRepository = AppDataSource.getRepository(PracticePlan);
        const taskRepository = AppDataSource.getRepository(PracticeTask);

        const existingPlan = await planRepository.findOne({
            where: { userId: req.userId! }
        });

        if (existingPlan) {
            await taskRepository.delete({ planId: existingPlan.id });
            await planRepository.delete({ id: existingPlan.id });
        }

        const plan = new PracticePlan();
        plan.userId = req.userId!;
        const savedPlan = await planRepository.save(plan);

        const taskEntities = tasks.map((task: any) => {
            const practiceTask = new PracticeTask();
            practiceTask.planId = savedPlan.id;
            practiceTask.date = new Date(task.date);
            practiceTask.topic = task.topic;
            practiceTask.question = task.question;
            practiceTask.difficulty = task.difficulty;
            practiceTask.estimateMins = task.estimateMins;
            practiceTask.order = task.order;
            practiceTask.done = false;
            return practiceTask;
        });

        const savedTasks = await taskRepository.save(taskEntities);
        res.json({ ...savedPlan, tasks: savedTasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save plan' });
    }
};

export const getSavedPlan = async (req: AuthRequest, res: Response) => {
    try {
        const planRepository = AppDataSource.getRepository(PracticePlan);
        const plan = await planRepository.findOne({
            where: { userId: req.userId! },
            relations: ['tasks']
        });

        if (plan && plan.tasks) {
            plan.tasks.sort((a, b) => {
                if (a.date.getTime() !== b.date.getTime()) {
                    return a.date.getTime() - b.date.getTime();
                }
                return a.order - b.order;
            });
        }

        res.json(plan ?? null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get saved plan' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskRepository = AppDataSource.getRepository(PracticeTask);
        const task = await taskRepository.findOne({
            where: { id: req.params.taskId as string }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (req.body.done !== undefined) task.done = req.body.done;
        if (req.body.date) task.date = new Date(req.body.date);
        if (req.body.question) task.question = req.body.question;
        if (req.body.difficulty) task.difficulty = req.body.difficulty;
        if (req.body.estimateMins) task.estimateMins = req.body.estimateMins;
        if (req.body.note !== undefined) task.note = req.body.note;

        const updated = await taskRepository.save(task);
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const taskRepository = AppDataSource.getRepository(PracticeTask);
        await taskRepository.delete({ id: req.params.taskId as string });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

export const addTask = async (req: AuthRequest, res: Response) => {
    try {
        const planRepository = AppDataSource.getRepository(PracticePlan);
        const plan = await planRepository.findOne({
            where: { userId: req.userId! }
        });

        if (!plan) {
            return res.status(404).json({ error: 'No plan found. Generate one first.' });
        }

        const taskRepository = AppDataSource.getRepository(PracticeTask);
        const task = new PracticeTask();
        task.planId = plan.id;
        task.date = new Date(req.body.date);
        task.topic = req.body.topic;
        task.question = req.body.question;
        task.difficulty = req.body.difficulty || 'medium';
        task.estimateMins = req.body.estimateMins || 30;
        task.order = req.body.order || 999;
        task.done = false;

        const saved = await taskRepository.save(task);
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add task' });
    }
};