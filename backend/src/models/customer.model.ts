import { Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { Customer } from '../types/entities.types';

export function getCustomerCollection(): Collection<Customer> {
  const db = getDatabase();
  return db.collection('customers');
}
