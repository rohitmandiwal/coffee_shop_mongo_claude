import { z } from 'zod';

export const customerFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
