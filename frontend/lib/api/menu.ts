import { apiClient } from './client';

export interface MenuItem {
  _id: string;
  name: string;
  category: 'Coffee' | 'Tea' | 'Pastry' | 'Sandwich' | 'Dessert' | 'Beverage';
  description: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuListResponse {
  items: MenuItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export async function createMenuItem(data: Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>) {
  return apiClient.post<MenuItem>('/api/menu-items', data);
}

export async function getMenuItems(
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string,
  isAvailable?: boolean
) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (isAvailable !== undefined) params.append('isAvailable', isAvailable.toString());

  return apiClient.get<MenuItem[]>(`/api/menu-items?${params.toString()}`);
}

export async function getMenuItemById(id: string) {
  return apiClient.get<MenuItem>(`/api/menu-items/${id}`);
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  return apiClient.patch<MenuItem>(`/api/menu-items/${id}`, data);
}

export async function deleteMenuItem(id: string) {
  return apiClient.delete<any>(`/api/menu-items/${id}`);
}

export async function toggleMenuItemAvailability(id: string) {
  return apiClient.patch<MenuItem>(`/api/menu-items/${id}/availability`, {});
}
