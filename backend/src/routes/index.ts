import { Router } from 'express';
import menuRoutes from './menu.routes';
import customerRoutes from './customer.routes';
import orderRoutes from './order.routes';
import reportRoutes from './report.routes';
import transactionRoutes from './transaction.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/menu-items', menuRoutes);
router.use('/api/customers', customerRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/reports', reportRoutes);
router.use('/api/transactions', transactionRoutes);

export default router;
