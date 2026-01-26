import { Router } from 'express';
import menuRoutes from './menu.routes';
import customerRoutes from './customer.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/menu-items', menuRoutes);
router.use('/api/customers', customerRoutes);

export default router;
