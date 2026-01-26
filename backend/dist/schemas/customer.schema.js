"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerFilterSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.createCustomerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, 'Full name is required').max(100),
    phone: zod_1.z.string().min(10, 'Phone must be at least 10 characters'),
    email: zod_1.z.string().email('Invalid email').optional().or(zod_1.z.literal('')),
    notes: zod_1.z.string().max(500).optional(),
});
exports.updateCustomerSchema = exports.createCustomerSchema.partial();
exports.customerFilterSchema = zod_1.z.object({
    ...common_schema_1.paginationSchema.shape,
    search: zod_1.z.string().optional(),
});
//# sourceMappingURL=customer.schema.js.map