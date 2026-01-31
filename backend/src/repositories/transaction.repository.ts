import { ObjectId } from 'mongodb';
import { getTransactionCollection } from '../models/transaction.model';
import { Transaction } from '../types/entities.types';
import { getSkip } from '../utils/pagination.util';

export class TransactionRepository {
  async create(
    data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const collection = getTransactionCollection();
    const now = new Date();
    const doc: Transaction = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findById(id: string): Promise<Transaction | null> {
    const collection = getTransactionCollection();
    return collection.findOne({ _id: new ObjectId(id) });
  }

  async updateOrderId(transactionId: ObjectId, orderId: ObjectId): Promise<void> {
    const collection = getTransactionCollection();
    await collection.updateOne(
      { _id: transactionId },
      {
        $set: { orderId, updatedAt: new Date() },
      }
    );
  }

  async findByOrderId(orderId: string): Promise<Transaction | null> {
    const collection = getTransactionCollection();
    return collection.findOne({ orderId: new ObjectId(orderId) });
  }

  async findByCustomerId(
    customerId: string,
    page: number,
    limit: number
  ): Promise<{ items: Transaction[]; total: number }> {
    const collection = getTransactionCollection();
    const query = { customerId: new ObjectId(customerId) };

    const [items, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(getSkip(page, limit))
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return { items, total };
  }

  async findAll(page: number, limit: number): Promise<{ items: Transaction[]; total: number }> {
    const collection = getTransactionCollection();

    const [items, total] = await Promise.all([
      collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(getSkip(page, limit))
        .limit(limit)
        .toArray(),
      collection.countDocuments({}),
    ]);

    return { items, total };
  }
}

export const transactionRepository = new TransactionRepository();
