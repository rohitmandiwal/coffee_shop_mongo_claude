"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.createIndexes = createIndexes;
exports.getDatabase = getDatabase;
exports.disconnectDatabase = disconnectDatabase;
exports.checkDatabaseHealth = checkDatabaseHealth;
const mongodb_1 = require("mongodb");
const environment_1 = require("./environment");
const logger_util_1 = require("../utils/logger.util");
let client = null;
let db = null;
async function connectDatabase() {
    if (db) {
        logger_util_1.logger.debug('Using cached database connection');
        return db;
    }
    try {
        logger_util_1.logger.info('Connecting to MongoDB...');
        client = new mongodb_1.MongoClient(environment_1.env.MONGO_URI, {
            maxPoolSize: 100,
            minPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        await client.connect();
        db = client.db();
        logger_util_1.logger.info('Connected to MongoDB successfully');
        await createIndexes(db);
        return db;
    }
    catch (error) {
        logger_util_1.logger.error('Failed to connect to MongoDB', error);
        throw error;
    }
}
async function createIndexes(database) {
    try {
        logger_util_1.logger.info('Creating database indexes...');
        const menuCollection = database.collection('menu_items');
        await menuCollection.createIndex({ name: 'text', description: 'text' });
        await menuCollection.createIndex({ category: 1, isAvailable: 1 });
        await menuCollection.createIndex({ price: 1, isAvailable: 1 });
        await menuCollection.createIndex({ createdAt: -1 });
        const customerCollection = database.collection('customers');
        await customerCollection.createIndex({ phone: 1 }, { unique: true });
        await customerCollection.createIndex({ fullName: 'text' });
        await customerCollection.createIndex({ email: 1 }, { unique: true, sparse: true });
        await customerCollection.createIndex({ createdAt: -1 });
        const orderCollection = database.collection('orders');
        await orderCollection.createIndex({ orderDate: -1 });
        await orderCollection.createIndex({ customerId: 1, orderDate: -1 });
        await orderCollection.createIndex({ status: 1, orderDate: -1 });
        await orderCollection.createIndex({ createdAt: -1 });
        logger_util_1.logger.info('Database indexes created successfully');
    }
    catch (error) {
        logger_util_1.logger.warn('Error creating indexes', error);
    }
}
function getDatabase() {
    if (!db) {
        throw new Error('Database not connected. Call connectDatabase() first.');
    }
    return db;
}
async function disconnectDatabase() {
    if (client) {
        await client.close();
        logger_util_1.logger.info('Disconnected from MongoDB');
        client = null;
        db = null;
    }
}
async function checkDatabaseHealth() {
    try {
        if (!db)
            return false;
        const admin = db.admin();
        await admin.ping();
        return true;
    }
    catch (error) {
        logger_util_1.logger.error('Database health check failed', error);
        return false;
    }
}
//# sourceMappingURL=database.js.map