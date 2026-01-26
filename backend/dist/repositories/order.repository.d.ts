import { ObjectId } from 'mongodb';
import { Order, OrderStatus } from '../types/entities.types';
export declare class OrderRepository {
    create(data: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
    findAll(page: number, limit: number, filters?: {
        fromDate?: Date;
        toDate?: Date;
        customerId?: ObjectId;
        status?: OrderStatus;
    }): Promise<{
        items: Order[];
        total: number;
    }>;
    findById(id: string | ObjectId): Promise<Order | null>;
    updateStatus(id: string | ObjectId, status: OrderStatus): Promise<Order | null>;
    findByCustomerId(customerId: ObjectId, page: number, limit: number): Promise<{
        items: Order[];
        total: number;
    }>;
}
export declare const orderRepository: OrderRepository;
//# sourceMappingURL=order.repository.d.ts.map