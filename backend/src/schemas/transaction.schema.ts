import { z } from 'zod';

export const processPaymentSchema = z.object({
  customerId: z.string().length(24, 'Invalid customer ID'),
  amount: z.number().positive('Amount must be positive'),
  paymentMode: z.enum(['Cash', 'UPI', 'Card']),
  simulateStatus: z
    .enum(['Success', 'CardDeclined', 'InsufficientFunds', 'CardLimitExceeded'])
    .default('Success'),
});

export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
