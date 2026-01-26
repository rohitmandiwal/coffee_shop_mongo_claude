import { Router } from 'express';
import menuRoutes from './menu.routes';
import customerRoutes from './customer.routes';
import orderRoutes from './order.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/menu-items', menuRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/orders', orderRoutes);

export default router;
