// backend/src/routes/ai-plan.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/ai-plan.controller';

const router = Router();
router.use(authenticate);

router.get('/generate', ctrl.generatePlan);
router.post('/save', ctrl.savePlan);
router.get('/saved', ctrl.getSavedPlan);
router.patch('/task/:taskId', ctrl.updateTask);
router.delete('/task/:taskId', ctrl.deleteTask);
router.post('/task', ctrl.addTask);

export default router;