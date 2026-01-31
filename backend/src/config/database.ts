import { MongoClient, Db } from 'mongodb';
import { env } from './environment';
import { logger } from '../utils/logger.util';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDatabase(): Promise<Db> {
  if (db) {
    logger.debug('Using cached database connection');
    return db;
  }

  try {
    logger.info('Connecting to MongoDB...');
    client = new MongoClient(env.MONGO_URI, {
      maxPoolSize: 100,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    db = client.db();

    logger.info('Connected to MongoDB successfully');
    await createIndexes(db);

    return db;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

export async function createIndexes(database: Db): Promise<void> {
  try {
    logger.info('Creating database indexes...');

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

    const transactionCollection = database.collection('transactions');
    await transactionCollection.createIndex({ customerId: 1, createdAt: -1 });
    await transactionCollection.createIndex({ orderId: 1 });
    await transactionCollection.createIndex({ status: 1, createdAt: -1 });
    await transactionCollection.createIndex({ gatewayTransactionId: 1 }, { unique: true });
    await transactionCollection.createIndex({ createdAt: -1 });

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.warn('Error creating indexes', error);
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDatabase() first.');
  }
  return db;
}

export async function disconnectDatabase(): Promise<void> {
  if (client) {
    await client.close();
    logger.info('Disconnected from MongoDB');
    client = null;
    db = null;
  }
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (!db) return false;
    const admin = db.admin();
    await admin.ping();
    return true;
  } catch (error) {
    logger.error('Database health check failed', error);
    return false;
  }
}
