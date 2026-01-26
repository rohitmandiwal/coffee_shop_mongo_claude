import { z } from 'zod';
import { MenuCategory } from '../types/entities.types';
export declare const createMenuItemSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodNativeEnum<typeof MenuCategory>;
    description: z.ZodString;
    price: z.ZodNumber;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    category: MenuCategory;
    isAvailable: boolean;
    price: number;
}, {
    name: string;
    description: string;
    category: MenuCategory;
    price: number;
    isAvailable?: boolean | undefined;
}>;
export declare const updateMenuItemSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof MenuCategory>>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    isAvailable: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    category?: MenuCategory | undefined;
    isAvailable?: boolean | undefined;
    price?: number | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    category?: MenuCategory | undefined;
    isAvailable?: boolean | undefined;
    price?: number | undefined;
}>;
export declare const menuFilterSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodNativeEnum<typeof MenuCategory>>;
    isAvailable: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    minPrice: z.ZodOptional<z.ZodNumber>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    search?: string | undefined;
    category?: MenuCategory | undefined;
    isAvailable?: "true" | "false" | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
}, {
    search?: string | undefined;
    category?: MenuCategory | undefined;
    isAvailable?: "true" | "false" | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuFilterInput = z.infer<typeof menuFilterSchema>;
//# sourceMappingURL=menu.schema.d.ts.map