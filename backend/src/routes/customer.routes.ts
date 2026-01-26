import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';

const router = Router();

router.post('/', (req, res, next) => customerController.createCustomer(req, res, next));
router.get('/', (req, res, next) => customerController.getCustomers(req, res, next));
router.get('/:id', (req, res, next) => customerController.getCustomerById(req, res, next));
router.patch('/:id', (req, res, next) => customerController.updateCustomer(req, res, next));
router.delete('/:id', (req, res, next) => customerController.deleteCustomer(req, res, next));

export default router;
