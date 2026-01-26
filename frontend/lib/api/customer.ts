import { apiClient } from './client';

export interface Customer {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListResponse {
  items: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function createCustomer(data: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>) {
  return apiClient.post<Customer>('/api/customers', data);
}

export async function getCustomers(page: number = 1, limit: number = 10, search?: string) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);

  return apiClient.get<Customer[]>(`/api/customers?${params.toString()}`);
}

export async function getCustomerById(id: string) {
  return apiClient.get<Customer>(`/api/customers/${id}`);
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  return apiClient.patch<Customer>(`/api/customers/${id}`, data);
}

export async function deleteCustomer(id: string) {
  return apiClient.delete<any>(`/api/customers/${id}`);
}
