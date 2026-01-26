"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = exports.OrderRepository = void 0;
const mongodb_1 = require("mongodb");
const order_model_1 = require("../models/order.model");
const pagination_util_1 = require("../utils/pagination.util");
class OrderRepository {
    async create(data) {
        const collection = (0, order_model_1.getOrderCollection)();
        const now = new Date();
        const doc = {
            ...data,
            createdAt: now,
            updatedAt: now,
        };
        const result = await collection.insertOne(doc);
        return { ...doc, _id: result.insertedId };
    }
    async findAll(page, limit, filters) {
        const collection = (0, order_model_1.getOrderCollection)();
        const query = {};
        if (filters?.customerId) {
            query.customerId = filters.customerId;
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        if (filters?.fromDate || filters?.toDate) {
            query.orderDate = {};
            if (filters?.fromDate) {
                query.orderDate.$gte = filters.fromDate;
            }
            if (filters?.toDate) {
                query.orderDate.$lte = filters.toDate;
            }
        }
        const total = await collection.countDocuments(query);
        const items = await collection
            .find(query)
            .sort({ orderDate: -1 })
            .skip((0, pagination_util_1.getSkip)(page, limit))
            .limit(limit)
            .toArray();
        return { items, total };
    }
    async findById(id) {
        const collection = (0, order_model_1.getOrderCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return collection.findOne({ _id: objectId });
    }
    async updateStatus(id, status) {
        const collection = (0, order_model_1.getOrderCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await collection.findOneAndUpdate({ _id: objectId }, { $set: { status, updatedAt: new Date() } }, { returnDocument: 'after' });
        return result || null;
    }
    async findByCustomerId(customerId, page, limit) {
        const collection = (0, order_model_1.getOrderCollection)();
        const query = { customerId };
        const total = await collection.countDocuments(query);
        const items = await collection
            .find(query)
            .sort({ orderDate: -1 })
            .skip((0, pagination_util_1.getSkip)(page, limit))
            .limit(limit)
            .toArray();
        return { items, total };
    }
}
exports.OrderRepository = OrderRepository;
exports.orderRepository = new OrderRepository();
//# sourceMappingURL=order.repository.js.map