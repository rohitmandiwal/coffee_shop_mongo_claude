"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.post('/', order_controller_1.orderController.createOrder);
router.get('/', order_controller_1.orderController.getOrders);
router.get('/customers/:customerId', order_controller_1.orderController.getCustomerOrders);
router.get('/:id', order_controller_1.orderController.getOrderById);
router.patch('/:id/status', order_controller_1.orderController.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map