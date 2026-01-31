import { Router } from 'express';
import { reportController } from '../controllers/report.controller';

const router = Router();

router.get('/top-selling-items', reportController.getTopSellingItems.bind(reportController));
router.get('/most-sold-coffee', reportController.getMostSoldCoffee.bind(reportController));
router.get('/most-regular-customer', reportController.getMostRegularCustomer.bind(reportController));
router.get('/sales-summary', reportController.getSalesSummary.bind(reportController));
router.get('/dashboard-kpis', reportController.getDashboardKPIs.bind(reportController));

export default router;
