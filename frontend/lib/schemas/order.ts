import { z } from 'zod';

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least 1 item'),
  discount: z.number().nonnegative('Discount cannot be negative').optional().default(0),
  tax: z.number().nonnegative('Tax cannot be negative').optional().default(0),
  paymentMode: z.enum(['Cash', 'UPI', 'Card']).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Created', 'Paid']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
