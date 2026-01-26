import { z } from 'zod';
import { OrderStatus, PaymentMode } from '../types/entities.types';
export declare const orderItemSchema: z.ZodObject<{
    menuItemId: z.ZodEffects<z.ZodString, string, string>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    menuItemId: string;
    quantity: number;
}, {
    menuItemId: string;
    quantity: number;
}>;
export declare const createOrderSchema: z.ZodObject<{
    customerId: z.ZodEffects<z.ZodString, string, string>;
    items: z.ZodArray<z.ZodObject<{
        menuItemId: z.ZodEffects<z.ZodString, string, string>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        menuItemId: string;
        quantity: number;
    }, {
        menuItemId: string;
        quantity: number;
    }>, "many">;
    discount: z.ZodOptional<z.ZodNumber>;
    tax: z.ZodOptional<z.ZodNumber>;
    paymentMode: z.ZodOptional<z.ZodNativeEnum<typeof PaymentMode>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    items: {
        menuItemId: string;
        quantity: number;
    }[];
    discount?: number | undefined;
    tax?: number | undefined;
    paymentMode?: PaymentMode | undefined;
}, {
    customerId: string;
    items: {
        menuItemId: string;
        quantity: number;
    }[];
    discount?: number | undefined;
    tax?: number | undefined;
    paymentMode?: PaymentMode | undefined;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof OrderStatus>;
}, "strip", z.ZodTypeAny, {
    status: OrderStatus;
}, {
    status: OrderStatus;
}>;
export declare const orderFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof OrderStatus>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    customerId?: string | undefined;
    status?: OrderStatus | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
}, {
    customerId?: string | undefined;
    status?: OrderStatus | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
//# sourceMappingURL=order.schema.d.ts.map