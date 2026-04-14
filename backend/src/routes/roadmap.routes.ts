// backend/src/routes/roadmap.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as roadmapController from '../controllers/roadmap.controller';

const router = Router();
router.use(authenticate);

router.get('/', roadmapController.getRoadmap);
router.get('/:id', roadmapController.getRoadmapById);
router.post('/', roadmapController.createWeek);
router.put('/:id', roadmapController.updateWeek);
router.delete('/:id', roadmapController.deleteWeek);

export default router;