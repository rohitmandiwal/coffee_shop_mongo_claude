import { apiClient } from './client';

export interface Transaction {
  _id: string;
  orderId?: string;
  customerId: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card';
  status: 'Success' | 'CardDeclined' | 'InsufficientFunds' | 'CardLimitExceeded';
  gatewayTransactionId: string;
  gatewayResponse: string;
  attemptedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const transactionApi = {
  getById: (id: string) => apiClient.get<Transaction>(`/api/transactions/${id}`),

  getByOrderId: (orderId: string) =>
    apiClient.get<Transaction>(`/api/transactions/order/${orderId}`),

  getCustomerTransactions: (customerId: string, page: number = 1, limit: number = 10) =>
    apiClient.get<Transaction[]>(
      `/api/transactions/customer/${customerId}?page=${page}&limit=${limit}`
    ),

  getAll: (page: number = 1, limit: number = 10) =>
    apiClient.get<Transaction[]>(`/api/transactions?page=${page}&limit=${limit}`),
};
