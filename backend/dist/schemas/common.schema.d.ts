import { z } from 'zod';
export declare const objectIdSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type PaginationInput = z.infer<typeof paginationSchema>;
//# sourceMappingURL=common.schema.d.ts.map