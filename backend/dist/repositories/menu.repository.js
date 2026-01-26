"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRepository = exports.MenuRepository = void 0;
const mongodb_1 = require("mongodb");
const menu_model_1 = require("../models/menu.model");
const pagination_util_1 = require("../utils/pagination.util");
class MenuRepository {
    async create(data) {
        const collection = (0, menu_model_1.getMenuCollection)();
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
        const collection = (0, menu_model_1.getMenuCollection)();
        const query = {};
        if (filters?.search) {
            query.$text = { $search: filters.search };
        }
        if (filters?.category) {
            query.category = filters.category;
        }
        if (filters?.isAvailable !== undefined) {
            query.isAvailable = filters.isAvailable;
        }
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            query.price = {};
            if (filters?.minPrice !== undefined) {
                query.price.$gte = filters.minPrice;
            }
            if (filters?.maxPrice !== undefined) {
                query.price.$lte = filters.maxPrice;
            }
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
        const collection = (0, menu_model_1.getMenuCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        return collection.findOne({ _id: objectId });
    }
    async update(id, data) {
        const collection = (0, menu_model_1.getMenuCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await collection.findOneAndUpdate({ _id: objectId }, { $set: { ...data, updatedAt: new Date() } }, { returnDocument: 'after' });
        return result || null;
    }
    async delete(id) {
        const collection = (0, menu_model_1.getMenuCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const result = await collection.deleteOne({ _id: objectId });
        return result.deletedCount > 0;
    }
    async toggleAvailability(id) {
        const collection = (0, menu_model_1.getMenuCollection)();
        const objectId = typeof id === 'string' ? new mongodb_1.ObjectId(id) : id;
        const item = await collection.findOne({ _id: objectId });
        if (!item)
            return null;
        const result = await collection.findOneAndUpdate({ _id: objectId }, {
            $set: {
                isAvailable: !item.isAvailable,
                updatedAt: new Date(),
            },
        }, { returnDocument: 'after' });
        return result || null;
    }
}
exports.MenuRepository = MenuRepository;
exports.menuRepository = new MenuRepository();
//# sourceMappingURL=menu.repository.js.map