"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRepository = exports.CustomerRepository = void 0;
const mongodb_1 = require("mongodb");
const customer_model_1 = require("../models/customer.model");
const errors_types_1 = require("../types/errors.types");
const pagination_util_1 = require("../utils/pagination.util");
class CustomerRepository {
    async create(data) {
        const collection = (0, customer_model_1.getCustomerCollection)();
        const now = new Date();
        const doc = {
            ...data,
            createdAt: now,
            updatedAt: now,
        };
        try {
            const result = await collection.insertOne(doc);
            return { ...doc, _id: result.insertedId };
        }
        catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new errors_types_1.ConflictError(`${field} already exists`);
            }
            throw error;
        }
    }
    async findAll(page, limit, filters) {
        const collection = (0, customer_model_1.getCustomerCollection)();
        const query = {};
        if (filters?.search) {
            query.$text = { $search: filters.search };
        }
        const total = await collection.countDocuments(query);
        const items = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .skip((0, pagination_util_1.getSkip)(page, limit))
            .limit(limit)
            .toArray();
        return { items, total };
    }
    async findById(id) {
        const collection = (0, customer_model_1.getCustomerCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return collection.findOne({ _id: objectId });
    }
    async update(id, data) {
        const collection = (0, customer_model_1.getCustomerCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        try {
            const result = await collection.findOneAndUpdate({ _id: objectId }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' });
            return result || null;
        }
        catch (error) {
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                throw new errors_types_1.ConflictError(`${field} already exists`);
            }
            throw error;
        }
    }
    async delete(id) {
        const collection = (0, customer_model_1.getCustomerCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await collection.deleteOne({ _id: objectId });
        return result.deletedCount > 0;
    }
}
exports.CustomerRepository = CustomerRepository;
exports.customerRepository = new CustomerRepository();
//# sourceMappingURL=customer.repository.js.map