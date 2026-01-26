import { Order } from '../types/entities.types';
import { CreateOrderInput, UpdateOrderStatusInput, OrderFilterInput } from '../schemas/order.schema';
export declare class OrderService {
    createOrder(input: CreateOrderInput): Promise<Order>;
    getOrders(input: OrderFilterInput): Promise<{
        items: Order[];
        total: number;
    }>;
    getOrderById(id: string): Promise<Order>;
    updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<Order>;
    getCustomerOrders(customerId: string, page?: number, limit?: number): Promise<{
        items: Order[];
        total: number;
    }>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=order.service.d.ts.map