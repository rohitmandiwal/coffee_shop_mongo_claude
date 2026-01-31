import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import {
  topSellingItemsSchema,
  mostSoldCoffeeSchema,
  mostRegularCustomerSchema,
  salesSummarySchema,
} from '../schemas/report.schema';
import { success } from '../utils/response.util';

export class ReportController {
  async getTopSellingItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = topSellingItemsSchema.parse(req.query);
      const items = await reportService.getTopSellingItems(input);
      res.json(success(items));
    } catch (error) {
      next(error);
    }
  }

  async getMostSoldCoffee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = mostSoldCoffeeSchema.parse(req.query);
      const coffee = await reportService.getMostSoldCoffee(input);
      res.json(success(coffee));
    } catch (error) {
      next(error);
    }
  }

  async getMostRegularCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = mostRegularCustomerSchema.parse(req.query);
      const customer = await reportService.getMostRegularCustomer(input);
      res.json(success(customer));
    } catch (error) {
      next(error);
    }
  }

  async getSalesSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = salesSummarySchema.parse(req.query);
      const summary = await reportService.getSalesSummary(input);
      res.json(success(summary));
    } catch (error) {
      next(error);
    }
  }

  async getDashboardKPIs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kpis = await reportService.getDashboardKPIs();
      res.json(success(kpis));
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
