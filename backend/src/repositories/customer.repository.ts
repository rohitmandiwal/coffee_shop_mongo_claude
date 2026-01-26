import { ObjectId } from 'mongodb';
import { getCustomerCollection } from '../models/customer.model';
import { Customer } from '../types/entities.types';
import { ConflictError } from '../types/errors.types';
import { getSkip } from '../utils/pagination.util';

export class CustomerRepository {
  async create(data: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const collection = getCustomerCollection();
    const now = new Date();
    const doc: Customer = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const result = await collection.insertOne(doc);
      return { ...doc, _id: result.insertedId };
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictError(`${field} already exists`);
      }
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      search?: string;
    }
  ): Promise<{ items: Customer[]; total: number }> {
    const collection = getCustomerCollection();
    const query: any = {};

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const total = await collection.countDocuments(query);
    const items = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(getSkip(page, limit))
      .limit(limit)
      .toArray();

    return { items, total };
  }

  async findById(id: string | ObjectId): Promise<Customer | null> {
    const collection = getCustomerCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async update(id: string | ObjectId, data: Partial<Customer>): Promise<Customer | null> {
    const collection = getCustomerCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    try {
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return result || null;
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictError(`${field} already exists`);
      }
      throw error;
    }
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const collection = getCustomerCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }
}

export const customerRepository = new CustomerRepository();
