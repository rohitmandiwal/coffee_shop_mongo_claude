import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';

const router = Router();

router.get('/', transactionController.getAllTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));
router.get(
  '/customer/:customerId',
  transactionController.getCustomerTransactions.bind(transactionController)
);
router.get('/order/:orderId', transactionController.getOrderTransaction.bind(transactionController));

export default router;
