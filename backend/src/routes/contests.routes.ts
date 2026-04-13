// src/routes/contests.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as contestsController from '../controllers/contests.controller';

const router = Router();
router.use(authenticate);

router.get('/', contestsController.getContests);
router.post('/', contestsController.createContest);
router.put('/:id', contestsController.updateContest);
router.delete('/:id', contestsController.deleteContest);

export default router;