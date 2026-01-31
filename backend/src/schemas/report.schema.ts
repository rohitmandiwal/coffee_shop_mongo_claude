import { z } from 'zod';

export const topSellingItemsSchema = z.object({
  from: z.string().datetime('Invalid from date'),
  to: z.string().datetime('Invalid to date'),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const mostSoldCoffeeSchema = z.object({
  from: z.string().datetime('Invalid from date'),
  to: z.string().datetime('Invalid to date'),
});

export const mostRegularCustomerSchema = z.object({
  from: z.string().datetime('Invalid from date'),
  to: z.string().datetime('Invalid to date'),
  by: z.enum(['orders', 'spend']).default('orders'),
});

export const salesSummarySchema = z.object({
  from: z.string().datetime('Invalid from date'),
  to: z.string().datetime('Invalid to date'),
  bucket: z.enum(['day', 'week']).default('day'),
});

export type TopSellingItemsInput = z.infer<typeof topSellingItemsSchema>;
export type MostSoldCoffeeInput = z.infer<typeof mostSoldCoffeeSchema>;
export type MostRegularCustomerInput = z.infer<typeof mostRegularCustomerSchema>;
export type SalesSummaryInput = z.infer<typeof salesSummarySchema>;
