import { Collection } from 'mongodb';
import { getDatabase } from '../config/database';
import { Transaction } from '../types/entities.types';

export function getTransactionCollection(): Collection<Transaction> {
  return getDatabase().collection<Transaction>('transactions');
}
