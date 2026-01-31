import { apiClient, ApiResponse } from './client';

export interface OrderItem {
  menuItemId: string;
  itemNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  customerId: string;
  orderDate: string;
  status: 'Created' | 'Paid';
  items: OrderItem[];
  subTotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
  paymentMode?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  discount?: number;
  tax?: number;
  paymentMode?: 'Cash' | 'UPI' | 'Card';
  simulateStatus?: 'Success' | 'CardDeclined' | 'InsufficientFunds' | 'CardLimitExceeded';
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  customerId?: string;
  status?: string;
}

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiClient.post('/api/orders', data);
}

export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.fromDate) params.append('fromDate', filters.fromDate);
  if (filters.toDate) params.append('toDate', filters.toDate);
  if (filters.customerId) params.append('customerId', filters.customerId);
  if (filters.status) params.append('status', filters.status);

  const query = params.toString();
  const endpoint = `/api/orders${query ? `?${query}` : ''}`;
  return apiClient.get<Order[]>(endpoint);
}

export async function getOrderById(id: string): Promise<Order> {
  return apiClient.get(`/api/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: 'Created' | 'Paid'
): Promise<Order> {
  return apiClient.patch(`/api/orders/${id}/status`, { status });
}

export async function getCustomerOrders(
  customerId: string,
  page: number = 1,
  limit: number = 10
): Promise<Order[]> {
  return apiClient.get(
    `/api/orders/customers/${customerId}?page=${page}&limit=${limit}`
  );
}
