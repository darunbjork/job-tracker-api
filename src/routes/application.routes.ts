import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createApplicationSchema } from '../validations/application.validation.js';

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