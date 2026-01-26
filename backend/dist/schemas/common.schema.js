"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.objectIdSchema = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
exports.objectIdSchema = zod_1.z.string().refine((val) => {
    try {
        new mongodb_1.ObjectId(val);
        return true;
    }
    catch {
        return false;
    }
}, { message: 'Invalid ObjectId' });
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
//# sourceMappingURL=common.schema.js.map