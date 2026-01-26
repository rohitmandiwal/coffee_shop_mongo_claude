"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const mongodb_1 = require("mongodb");
const order_repository_1 = require("../repositories/order.repository");
const menu_repository_1 = require("../repositories/menu.repository");
const customer_repository_1 = require("../repositories/customer.repository");
const entities_types_1 = require("../types/entities.types");
const errors_types_1 = require("../types/errors.types");
class OrderService {
    async createOrder(input) {
        // Validate customer exists
        const customer = await customer_repository_1.customerRepository.findById(input.customerId);
        if (!customer) {
            throw new errors_types_1.NotFoundError(`Customer with id ${input.customerId} not found`);
        }
        // Build order items with snapshots
        const orderItems = [];
        let subTotal = 0;
        for (const item of input.items) {
            const menuItem = await menu_repository_1.menuRepository.findById(item.menuItemId);
            if (!menuItem) {
                throw new errors_types_1.NotFoundError(`Menu item with id ${item.menuItemId} not found`);
            }
            // Recommend checking availability
            if (!menuItem.isAvailable) {
                throw new errors_types_1.AppError(`Menu item "${menuItem.name}" is not available for ordering`, 400, 'ITEM_NOT_AVAILABLE');
            }
            const lineTotal = item.quantity * menuItem.price;
            orderItems.push({
                menuItemId: new mongodb_1.ObjectId(item.menuItemId),
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
        // Create order
        const order = await order_repository_1.orderRepository.create({
            customerId: new mongodb_1.ObjectId(input.customerId),
            orderDate: new Date(),
            status: entities_types_1.OrderStatus.Created,
            items: orderItems,
            subTotal,
            discount: discount > 0 ? discount : undefined,
            tax: tax > 0 ? tax : undefined,
            grandTotal,
            paymentMode: input.paymentMode,
        });
        return order;
    }
    async getOrders(input) {
        const filters = {};
        if (input.customerId) {
            filters.customerId = new mongodb_1.ObjectId(input.customerId);
        }
        if (input.status) {
            filters.status = input.status;
        }
        if (input.fromDate || input.toDate) {
            filters.fromDate = input.fromDate ? new Date(input.fromDate) : undefined;
            filters.toDate = input.toDate ? new Date(input.toDate) : undefined;
        }
        return order_repository_1.orderRepository.findAll(input.page, input.limit, filters);
    }
    async getOrderById(id) {
        const order = await order_repository_1.orderRepository.findById(id);
        if (!order) {
            throw new errors_types_1.NotFoundError(`Order with id ${id} not found`);
        }
        return order;
    }
    async updateOrderStatus(id, input) {
        const order = await order_repository_1.orderRepository.findById(id);
        if (!order) {
            throw new errors_types_1.NotFoundError(`Order with id ${id} not found`);
        }
        // Validate status transition (Created → Paid only for MVP)
        if (order.status === entities_types_1.OrderStatus.Paid) {
            throw new errors_types_1.AppError('Cannot change status of already paid order', 400, 'INVALID_STATUS_TRANSITION');
        }
        if (order.status === entities_types_1.OrderStatus.Created && input.status !== entities_types_1.OrderStatus.Paid) {
            throw new errors_types_1.AppError('Order can only transition from Created to Paid', 400, 'INVALID_STATUS_TRANSITION');
        }
        const updated = await order_repository_1.orderRepository.updateStatus(id, input.status);
        if (!updated) {
            throw new errors_types_1.NotFoundError(`Order with id ${id} not found`);
        }
        return updated;
    }
    async getCustomerOrders(customerId, page = 1, limit = 10) {
        // Verify customer exists
        const customer = await customer_repository_1.customerRepository.findById(customerId);
        if (!customer) {
            throw new errors_types_1.NotFoundError(`Customer with id ${customerId} not found`);
        }
        return order_repository_1.orderRepository.findByCustomerId(new mongodb_1.ObjectId(customerId), page, limit);
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
//# sourceMappingURL=order.service.js.map