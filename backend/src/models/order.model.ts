import { getDatabase } from '../config/database';
import { Order } from '../types/entities.types';
import { Collection } from 'mongodb';

export function getOrderCollection(): Collection<Order> {
  return getDatabase().collection<Order>('orders');
}
