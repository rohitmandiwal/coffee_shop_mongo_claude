import { ObjectId } from 'mongodb';
import { getOrderCollection } from '../models/order.model';
import { getDatabase } from '../config/database';
import {
  TopSellingItem,
  MostSoldCoffee,
  MostRegularCustomer,
  SalesSummaryItem,
} from '../types/entities.types';

export class ReportRepository {
  /**
   * Report 1: Top Selling Items
   * Groups by menuItemId and sorts by total quantity sold
   */
  async getTopSellingItems(
    fromDate: Date,
    toDate: Date,
    limit: number = 10
  ): Promise<TopSellingItem[]> {
    const collection = getOrderCollection();

    const pipeline = [
      {
        $match: {
          status: 'Paid',
          orderDate: { $gte: fromDate, $lte: toDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            menuItemId: '$items.menuItemId',
            name: '$items.itemNameSnapshot'
          },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.lineTotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          menuItemId: { $toString: '$_id.menuItemId' },
          itemName: '$_id.name',
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ];

    return collection.aggregate<TopSellingItem>(pipeline).toArray();
  }

  /**
   * Report 2: Most Sold Coffee
   * Filters to Coffee category only and returns top 1
   */
  async getMostSoldCoffee(
    fromDate: Date,
    toDate: Date
  ): Promise<MostSoldCoffee | null> {
    const collection = getOrderCollection();
    const db = getDatabase();

    const pipeline = [
      {
        $match: {
          status: 'Paid',
          orderDate: { $gte: fromDate, $lte: toDate }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menu_items',
          localField: 'items.menuItemId',
          foreignField: '_id',
          as: 'menuInfo'
        }
      },
      { $unwind: '$menuInfo' },
      { $match: { 'menuInfo.category': 'Coffee' } },
      {
        $group: {
          _id: '$items.menuItemId',
          itemName: { $first: '$items.itemNameSnapshot' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.lineTotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          menuItemId: { $toString: '$_id' },
          itemName: 1,
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ];

    const results = await collection.aggregate<MostSoldCoffee>(pipeline).toArray();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Report 3: Most Regular Customer
   * Can sort by order count or total spend
   */
  async getMostRegularCustomer(
    fromDate: Date,
    toDate: Date,
    sortBy: 'orders' | 'spend' = 'orders'
  ): Promise<MostRegularCustomer | null> {
    const collection = getOrderCollection();

    const sortField = sortBy === 'orders' ? 'orderCount' : 'totalSpend';

    const pipeline = [
      {
        $match: {
          status: 'Paid',
          orderDate: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: '$customerId',
          orderCount: { $sum: 1 },
          totalSpend: { $sum: '$grandTotal' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      { $unwind: '$customerInfo' },
      { $sort: { [sortField]: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          customerId: { $toString: '$_id' },
          customerName: '$customerInfo.fullName',
          customerPhone: '$customerInfo.phone',
          orderCount: 1,
          totalSpend: 1
        }
      }
    ];

    const results = await collection.aggregate<MostRegularCustomer>(pipeline).toArray();
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Report 4: Sales Summary
   * Groups by day or week with totals
   */
  async getSalesSummary(
    fromDate: Date,
    toDate: Date,
    bucket: 'day' | 'week' = 'day'
  ): Promise<SalesSummaryItem[]> {
    const collection = getOrderCollection();

    const dateFormat = bucket === 'day' ? '%Y-%m-%d' : '%Y-W%V';

    const pipeline = [
      {
        $match: {
          status: 'Paid',
          orderDate: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: dateFormat,
              date: '$orderDate',
              timezone: 'UTC'
            }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$grandTotal' },
          avgOrderValue: { $avg: '$grandTotal' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalOrders: 1,
          totalRevenue: 1,
          avgOrderValue: { $round: ['$avgOrderValue', 2] }
        }
      }
    ];

    return collection.aggregate<SalesSummaryItem>(pipeline).toArray();
  }
}

export const reportRepository = new ReportRepository();
