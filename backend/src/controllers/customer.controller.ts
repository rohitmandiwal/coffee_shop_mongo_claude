import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { createCustomerSchema, updateCustomerSchema, customerFilterSchema } from '../schemas/customer.schema';
import { success } from '../utils/response.util';
import { buildPaginationMeta } from '../utils/pagination.util';

export class CustomerController {
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = createCustomerSchema.parse(req.body);
      const customer = await customerService.createCustomer(input);
      res.status(201).json(success(customer));
    } catch (error) {
      next(error);
    }
  }

  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = customerFilterSchema.parse(req.query);
      const { items, total } = await customerService.getCustomers(input);
      const meta = buildPaginationMeta(input.page, input.limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.json(success(customer));
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = updateCustomerSchema.parse(req.body);
      const customer = await customerService.updateCustomer(req.params.id, input);
      res.json(success(customer));
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.json(success({ message: 'Customer deleted successfully' }));
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
