import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    fullName: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    fullName: string;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    phone: string;
    fullName: string;
    email?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateCustomerSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phone?: string | undefined;
    fullName?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    phone?: string | undefined;
    fullName?: string | undefined;
    email?: string | undefined;
    notes?: string | undefined;
}>;
export declare const customerFilterSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    search?: string | undefined;
}, {
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerFilterInput = z.infer<typeof customerFilterSchema>;
//# sourceMappingURL=customer.schema.d.ts.map