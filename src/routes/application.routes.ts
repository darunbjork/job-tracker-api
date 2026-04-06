import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createApplicationSchema } from '../validations/application.validation';

const router = Router();
const applicationController = new ApplicationController();

// * Require valid JWT for all routes below
router.use(protect);

// Notice validate() sits exactly between the route definition and the controller
router.post('/', validate(createApplicationSchema), applicationController.create.bind(applicationController));
router.get('/', applicationController.getAll.bind(applicationController));
router.get('/:id', applicationController.getById.bind(applicationController));
router.patch('/:id', applicationController.update.bind(applicationController));
router.delete('/:id', applicationController.delete.bind(applicationController));

export default router;