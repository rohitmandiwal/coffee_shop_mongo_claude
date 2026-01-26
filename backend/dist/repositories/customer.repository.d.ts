import { ObjectId } from 'mongodb';
import { Customer } from '../types/entities.types';
export declare class CustomerRepository {
    create(data: Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
    findAll(page: number, limit: number, filters?: {
        search?: string;
    }): Promise<{
        items: Customer[];
        total: number;
    }>;
    findById(id: string | ObjectId): Promise<Customer | null>;
    update(id: string | ObjectId, data: Partial<Customer>): Promise<Customer | null>;
    delete(id: string | ObjectId): Promise<boolean>;
}
export declare const customerRepository: CustomerRepository;
//# sourceMappingURL=customer.repository.d.ts.map