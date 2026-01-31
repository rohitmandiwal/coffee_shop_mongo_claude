import { reportRepository } from '../repositories/report.repository';
import {
  TopSellingItemsInput,
  MostSoldCoffeeInput,
  MostRegularCustomerInput,
  SalesSummaryInput,
} from '../schemas/report.schema';
import {
  TopSellingItem,
  MostSoldCoffee,
  MostRegularCustomer,
  SalesSummaryItem,
  DashboardKPIs,
} from '../types/entities.types';

export class ReportService {
  async getTopSellingItems(input: TopSellingItemsInput): Promise<TopSellingItem[]> {
    const fromDate = new Date(input.from);
    const toDate = new Date(input.to);

    return reportRepository.getTopSellingItems(fromDate, toDate, input.limit);
  }

  async getMostSoldCoffee(input: MostSoldCoffeeInput): Promise<MostSoldCoffee | null> {
    const fromDate = new Date(input.from);
    const toDate = new Date(input.to);

    return reportRepository.getMostSoldCoffee(fromDate, toDate);
  }

  async getMostRegularCustomer(input: MostRegularCustomerInput): Promise<MostRegularCustomer | null> {
    const fromDate = new Date(input.from);
    const toDate = new Date(input.to);

    return reportRepository.getMostRegularCustomer(fromDate, toDate, input.by);
  }

  async getSalesSummary(input: SalesSummaryInput): Promise<SalesSummaryItem[]> {
    const fromDate = new Date(input.from);
    const toDate = new Date(input.to);

    return reportRepository.getSalesSummary(fromDate, toDate, input.bucket);
  }

  /**
   * Dashboard KPIs - aggregates multiple reports
   */
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Month-to-date for regular customer
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [topItemsToday, regularCustomer, todaySales] = await Promise.all([
      reportRepository.getTopSellingItems(todayStart, todayEnd, 1),
      reportRepository.getMostRegularCustomer(monthStart, now, 'orders'),
      reportRepository.getSalesSummary(todayStart, todayEnd, 'day'),
    ]);

    return {
      todayOrders: todaySales.length > 0 ? todaySales[0].totalOrders : 0,
      todayRevenue: todaySales.length > 0 ? todaySales[0].totalRevenue : 0,
      topSellingItemToday: topItemsToday.length > 0 ? topItemsToday[0] : null,
      mostRegularCustomerMTD: regularCustomer,
    };
  }
}

export const reportService = new ReportService();
