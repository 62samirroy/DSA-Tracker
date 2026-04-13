// src/routes/logs.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as logsController from '../controllers/logs.controller';

const router = Router();
router.use(authenticate);

router.get('/', logsController.getLogs);
router.post('/', logsController.createLog);
router.put('/:id', logsController.updateLog);
router.delete('/:id', logsController.deleteLog);

export default router;