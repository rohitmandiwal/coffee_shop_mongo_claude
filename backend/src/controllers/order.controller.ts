import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderFilterSchema,
} from '../schemas/order.schema';
import { success } from '../utils/response.util';
import { buildPaginationMeta } from '../utils/pagination.util';

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(input);
      res.status(201).json(success(order));
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = orderFilterSchema.parse(req.query);
      const { items, total } = await orderService.getOrders(input);
      const meta = buildPaginationMeta(input.page, input.limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json(success(order));
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = updateOrderStatusSchema.parse(req.body);
      const order = await orderService.updateOrderStatus(req.params.id, input);
      res.json(success(order));
    } catch (error) {
      next(error);
    }
  }

  async getCustomerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { items, total } = await orderService.getCustomerOrders(req.params.customerId, page, limit);
      const meta = buildPaginationMeta(page, limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
