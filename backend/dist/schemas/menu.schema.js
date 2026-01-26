"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuFilterSchema = exports.updateMenuItemSchema = exports.createMenuItemSchema = void 0;
const zod_1 = require("zod");
const entities_types_1 = require("../types/entities.types");
const common_schema_1 = require("./common.schema");
exports.createMenuItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    category: zod_1.z.nativeEnum(entities_types_1.MenuCategory),
    description: zod_1.z.string().min(1, 'Description is required').max(500),
    price: zod_1.z.number().positive('Price must be positive'),
    isAvailable: zod_1.z.boolean().default(true),
});
exports.updateMenuItemSchema = exports.createMenuItemSchema.partial();
exports.menuFilterSchema = zod_1.z.object({
    ...common_schema_1.paginationSchema.shape,
    search: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(entities_types_1.MenuCategory).optional(),
    isAvailable: zod_1.z.enum(['true', 'false']).optional(),
    minPrice: zod_1.z.coerce.number().optional(),
    maxPrice: zod_1.z.coerce.number().optional(),
});
//# sourceMappingURL=menu.schema.js.map