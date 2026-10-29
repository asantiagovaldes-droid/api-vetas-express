import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthController);
router.get('/', healthController);

export default router;
