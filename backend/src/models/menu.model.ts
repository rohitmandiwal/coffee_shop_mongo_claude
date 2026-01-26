import { Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { MenuItem } from '../types/entities.types';

export function getMenuCollection(): Collection<MenuItem> {
  const db = getDatabase();
  return db.collection('menu_items');
}
