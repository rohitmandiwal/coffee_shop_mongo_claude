import { z } from 'zod';

export const menuFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.enum(['Coffee', 'Tea', 'Pastry', 'Sandwich', 'Dessert', 'Beverage']),
  description: z.string().min(1, 'Description is required').max(500),
  price: z.coerce.number().positive('Price must be greater than 0'),
  isAvailable: z.boolean().default(true),
});

export type MenuFormData = z.infer<typeof menuFormSchema>;
