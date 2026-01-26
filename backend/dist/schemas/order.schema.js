"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderFilterSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
const entities_types_1 = require("../types/entities.types");
const common_schema_1 = require("./common.schema");
exports.orderItemSchema = zod_1.z.object({
    menuItemId: common_schema_1.objectIdSchema,
    quantity: zod_1.z.number().int().positive('Quantity must be at least 1'),
});
exports.createOrderSchema = zod_1.z.object({
    customerId: common_schema_1.objectIdSchema,
    items: zod_1.z.array(exports.orderItemSchema).min(1, 'Order must have at least 1 item'),
    discount: zod_1.z.number().nonnegative('Discount cannot be negative').optional(),
    tax: zod_1.z.number().nonnegative('Tax cannot be negative').optional(),
    paymentMode: zod_1.z.nativeEnum(entities_types_1.PaymentMode).optional(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(entities_types_1.OrderStatus),
});
exports.orderFilterSchema = zod_1.z.object({
    ...common_schema_1.paginationSchema.shape,
    fromDate: zod_1.z.string().datetime().optional(),
    toDate: zod_1.z.string().datetime().optional(),
    customerId: common_schema_1.objectIdSchema.optional(),
    status: zod_1.z.nativeEnum(entities_types_1.OrderStatus).optional(),
});
//# sourceMappingURL=order.schema.js.map