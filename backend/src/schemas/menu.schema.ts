import { z } from 'zod';
import { MenuCategory } from '../types/entities.types';
import { paginationSchema } from './common.schema';

export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.nativeEnum(MenuCategory),
  description: z.string().min(1, 'Description is required').max(500),
  price: z.number().positive('Price must be positive'),
  isAvailable: z.boolean().default(true),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

export const menuFilterSchema = z.object({
  ...paginationSchema.shape,
  search: z.string().optional(),
  category: z.nativeEnum(MenuCategory).optional(),
  isAvailable: z.enum(['true', 'false']).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuFilterInput = z.infer<typeof menuFilterSchema>;
