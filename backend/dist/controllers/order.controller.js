"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const order_schema_1 = require("../schemas/order.schema");
const response_util_1 = require("../utils/response.util");
const pagination_util_1 = require("../utils/pagination.util");
class OrderController {
    async createOrder(req, res, next) {
        try {
            const input = order_schema_1.createOrderSchema.parse(req.body);
            const order = await order_service_1.orderService.createOrder(input);
            res.status(201).json((0, response_util_1.success)(order));
        }
        catch (error) {
            next(error);
        }
    }
    async getOrders(req, res, next) {
        try {
            const input = order_schema_1.orderFilterSchema.parse(req.query);
            const { items, total } = await order_service_1.orderService.getOrders(input);
            const meta = (0, pagination_util_1.buildPaginationMeta)(input.page, input.limit, total);
            res.json((0, response_util_1.success)(items, meta));
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderById(req, res, next) {
        try {
            const order = await order_service_1.orderService.getOrderById(req.params.id);
            res.json((0, response_util_1.success)(order));
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const input = order_schema_1.updateOrderStatusSchema.parse(req.body);
            const order = await order_service_1.orderService.updateOrderStatus(req.params.id, input);
            res.json((0, response_util_1.success)(order));
        }
        catch (error) {
            next(error);
        }
    }
    async getCustomerOrders(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const { items, total } = await order_service_1.orderService.getCustomerOrders(req.params.customerId, page, limit);
            const meta = (0, pagination_util_1.buildPaginationMeta)(page, limit, total);
            res.json((0, response_util_1.success)(items, meta));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
//# sourceMappingURL=order.controller.js.map