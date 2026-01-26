import { ObjectId } from 'mongodb';
import { getOrderCollection } from '../models/order.model';
import { Order, OrderStatus } from '../types/entities.types';
import { getSkip } from '../utils/pagination.util';

export class OrderRepository {
  async create(data: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const collection = getOrderCollection();
    const now = new Date();
    const doc: Order = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      fromDate?: Date;
      toDate?: Date;
      customerId?: ObjectId;
      status?: OrderStatus;
    }
  ): Promise<{ items: Order[]; total: number }> {
    const collection = getOrderCollection();
    const query: any = {};

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
      .skip(getSkip(page, limit))
      .limit(limit)
      .toArray();

    return { items, total };
  }

  async findById(id: string | ObjectId): Promise<Order | null> {
    const collection = getOrderCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async updateStatus(id: string | ObjectId, status: OrderStatus): Promise<Order | null> {
    const collection = getOrderCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  async findByCustomerId(
    customerId: ObjectId,
    page: number,
    limit: number
  ): Promise<{ items: Order[]; total: number }> {
    const collection = getOrderCollection();
    const query = { customerId };

    const total = await collection.countDocuments(query);
    const items = await collection
      .find(query)
      .sort({ orderDate: -1 })
      .skip(getSkip(page, limit))
      .limit(limit)
      .toArray();

    return { items, total };
  }
}

export const orderRepository = new OrderRepository();
