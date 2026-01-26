import { ObjectId } from 'mongodb';
import { getMenuCollection } from '../models/menu.model';
import { MenuItem, MenuCategory } from '../types/entities.types';
import { getSkip } from '../utils/pagination.util';

export class MenuRepository {
  async create(data: Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    const collection = getMenuCollection();
    const now = new Date();
    const doc: MenuItem = {
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
      search?: string;
      category?: MenuCategory;
      isAvailable?: boolean;
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<{ items: MenuItem[]; total: number }> {
    const collection = getMenuCollection();
    const query: any = {};

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
      .skip(getSkip(page, limit))
      .limit(limit)
      .toArray();

    return { items, total };
  }

  async findById(id: string | ObjectId): Promise<MenuItem | null> {
    const collection = getMenuCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async update(id: string | ObjectId, data: Partial<MenuItem>): Promise<MenuItem | null> {
    const collection = getMenuCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result || null;
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const collection = getMenuCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  async toggleAvailability(id: string | ObjectId): Promise<MenuItem | null> {
    const collection = getMenuCollection();
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    const item = await collection.findOne({ _id: objectId });
    if (!item) return null;

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          isAvailable: !item.isAvailable,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result || null;
  }
}

export const menuRepository = new MenuRepository();
