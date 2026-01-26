import { Router } from 'express';
import { orderController } from '../controllers/order.controller';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/customers/:customerId', orderController.getCustomerOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
