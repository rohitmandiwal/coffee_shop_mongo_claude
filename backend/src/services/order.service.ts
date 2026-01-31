import { ObjectId } from 'mongodb';
import { orderRepository } from '../repositories/order.repository';
import { menuRepository } from '../repositories/menu.repository';
import { customerRepository } from '../repositories/customer.repository';
import { Order, OrderStatus, PaymentStatus } from '../types/entities.types';
import { NotFoundError, AppError } from '../types/errors.types';
import { CreateOrderInput, UpdateOrderStatusInput, OrderFilterInput } from '../schemas/order.schema';
import { paymentService } from './payment.service';

export class OrderService {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    // Validate customer exists
    const customer = await customerRepository.findById(input.customerId);
    if (!customer) {
      throw new NotFoundError(`Customer with id ${input.customerId} not found`);
    }

    // Build order items with snapshots
    const orderItems = [];
    let subTotal = 0;

    for (const item of input.items) {
      const menuItem = await menuRepository.findById(item.menuItemId);
      if (!menuItem) {
        throw new NotFoundError(`Menu item with id ${item.menuItemId} not found`);
      }

      // Recommend checking availability
      if (!menuItem.isAvailable) {
        throw new AppError(
          `Menu item "${menuItem.name}" is not available for ordering`,
          400,
          'ITEM_NOT_AVAILABLE'
        );
      }

      const lineTotal = item.quantity * menuItem.price;
      orderItems.push({
        menuItemId: new ObjectId(item.menuItemId),
        itemNameSnapshot: menuItem.name,
        unitPriceSnapshot: menuItem.price,
        quantity: item.quantity,
        lineTotal,
      });

      subTotal += lineTotal;
    }

    // Calculate totals
    const discount = input.discount || 0;
    const tax = input.tax || 0;
    const grandTotal = subTotal - discount + tax;

    // Process payment BEFORE creating order
    const transaction = await paymentService.processPayment({
      customerId: input.customerId,
      amount: grandTotal,
      paymentMode: input.paymentMode || 'Cash',
      simulateStatus: input.simulateStatus || 'Success',
    });

    // If payment failed, throw error (order won't be created)
    if (transaction.status !== PaymentStatus.Success) {
      throw new AppError(
        `Payment failed: ${transaction.gatewayResponse}`,
        400,
        'PAYMENT_FAILED'
      );
    }

    // Payment succeeded - create order with "Paid" status
    const order = await orderRepository.create({
      customerId: new ObjectId(input.customerId),
      orderDate: new Date(),
      status: OrderStatus.Paid,
      items: orderItems,
      subTotal,
      discount: discount > 0 ? discount : undefined,
      tax: tax > 0 ? tax : undefined,
      grandTotal,
      paymentMode: input.paymentMode,
      transactionId: transaction._id,
    });

    // Link transaction to order
    if (transaction._id && order._id) {
      await paymentService.linkTransactionToOrder(transaction._id, order._id);
    }

    return order;
  }

  async getOrders(input: OrderFilterInput): Promise<{ items: Order[]; total: number }> {
    const filters: any = {};

    if (input.customerId) {
      filters.customerId = new ObjectId(input.customerId);
    }

    if (input.status) {
      filters.status = input.status;
    }

    if (input.fromDate || input.toDate) {
      filters.fromDate = input.fromDate ? new Date(input.fromDate) : undefined;
      filters.toDate = input.toDate ? new Date(input.toDate) : undefined;
    }

    return orderRepository.findAll(input.page, input.limit, filters);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Order with id ${id} not found`);
    }

    // Validate status transition (Created → Paid only for MVP)
    if (order.status === OrderStatus.Paid) {
      throw new AppError('Cannot change status of already paid order', 400, 'INVALID_STATUS_TRANSITION');
    }

    if (order.status === OrderStatus.Created && input.status !== OrderStatus.Paid) {
      throw new AppError('Order can only transition from Created to Paid', 400, 'INVALID_STATUS_TRANSITION');
    }

    const updated = await orderRepository.updateStatus(id, input.status);
    if (!updated) {
      throw new NotFoundError(`Order with id ${id} not found`);
    }

    return updated;
  }

  async getCustomerOrders(
    customerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: Order[]; total: number }> {
    // Verify customer exists
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundError(`Customer with id ${customerId} not found`);
    }

    return orderRepository.findByCustomerId(new ObjectId(customerId), page, limit);
  }
}

export const orderService = new OrderService();
