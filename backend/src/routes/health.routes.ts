import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

router.get('/', (req, res, next) => healthController.check(req, res, next));

export default router;
