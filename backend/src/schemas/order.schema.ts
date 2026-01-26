import { z } from 'zod';
import { OrderStatus, PaymentMode } from '../types/entities.types';
import { paginationSchema, objectIdSchema } from './common.schema';

export const orderItemSchema = z.object({
  menuItemId: objectIdSchema,
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  customerId: objectIdSchema,
  items: z.array(orderItemSchema).min(1, 'Order must have at least 1 item'),
  discount: z.number().nonnegative('Discount cannot be negative').optional(),
  tax: z.number().nonnegative('Tax cannot be negative').optional(),
  paymentMode: z.nativeEnum(PaymentMode).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const orderFilterSchema = z.object({
  ...paginationSchema.shape,
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  customerId: objectIdSchema.optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
