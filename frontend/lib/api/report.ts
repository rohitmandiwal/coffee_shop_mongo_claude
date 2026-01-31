import { apiClient } from './client';

export interface TopSellingItem {
  menuItemId: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostSoldCoffee {
  menuItemId: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostRegularCustomer {
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderCount: number;
  totalSpend: number;
}

export interface SalesSummaryItem {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface DashboardKPIs {
  todayOrders: number;
  todayRevenue: number;
  topSellingItemToday: TopSellingItem | null;
  mostRegularCustomerMTD: MostRegularCustomer | null;
}

export const reportApi = {
  getTopSellingItems: (from: string, to: string, limit: number = 10) =>
    apiClient.get<TopSellingItem[]>(`/api/reports/top-selling-items?from=${from}&to=${to}&limit=${limit}`),

  getMostSoldCoffee: (from: string, to: string) =>
    apiClient.get<MostSoldCoffee | null>(`/api/reports/most-sold-coffee?from=${from}&to=${to}`),

  getMostRegularCustomer: (from: string, to: string, by: 'orders' | 'spend' = 'orders') =>
    apiClient.get<MostRegularCustomer | null>(`/api/reports/most-regular-customer?from=${from}&to=${to}&by=${by}`),

  getSalesSummary: (from: string, to: string, bucket: 'day' | 'week' = 'day') =>
    apiClient.get<SalesSummaryItem[]>(`/api/reports/sales-summary?from=${from}&to=${to}&bucket=${bucket}`),

  getDashboardKPIs: () =>
    apiClient.get<DashboardKPIs>('/api/reports/dashboard-kpis'),
};
