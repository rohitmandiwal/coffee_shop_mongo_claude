import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { success } from '../utils/response.util';
import { buildPaginationMeta } from '../utils/pagination.util';

export class TransactionController {
  async getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await paymentService.getTransactionById(req.params.id);
      if (!transaction) {
        res.status(404).json({ success: false, error: 'Transaction not found' });
        return;
      }
      res.json(success(transaction));
    } catch (error) {
      next(error);
    }
  }

  async getCustomerTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { items, total } = await paymentService.getCustomerTransactions(
        req.params.customerId,
        page,
        limit
      );
      const meta = buildPaginationMeta(page, limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }

  async getAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { items, total } = await paymentService.getAllTransactions(page, limit);
      const meta = buildPaginationMeta(page, limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }

  async getOrderTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transaction = await paymentService.getTransactionByOrderId(req.params.orderId);
      if (!transaction) {
        res.status(404).json({ success: false, error: 'Transaction not found for this order' });
        return;
      }
      res.json(success(transaction));
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
