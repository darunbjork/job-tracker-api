import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
const applicationController = new ApplicationController();

// * Require valid JWT for all routes below
router.use(protect);

router.post('/', applicationController.create.bind(applicationController));
router.get('/', applicationController.getAll.bind(applicationController));
router.get('/:id', applicationController.getById.bind(applicationController));
router.patch('/:id', applicationController.update.bind(applicationController));
router.delete('/:id', applicationController.delete.bind(applicationController));

export default router;