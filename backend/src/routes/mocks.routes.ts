// src/routes/mocks.routes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as mocksController from '../controllers/mocks.controller';

const router = Router();
router.use(authenticate);

router.get('/', mocksController.getMocks);
router.post('/', mocksController.createMock);
router.put('/:id', mocksController.updateMock);
router.delete('/:id', mocksController.deleteMock);

export default router;