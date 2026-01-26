import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const objectIdSchema = z.string().refine(
  (val) => {
    try {
      new ObjectId(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Invalid ObjectId' }
);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
