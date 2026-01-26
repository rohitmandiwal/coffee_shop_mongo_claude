"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const router = (0, express_1.Router)();
router.post('/', (req, res, next) => customer_controller_1.customerController.createCustomer(req, res, next));
router.get('/', (req, res, next) => customer_controller_1.customerController.getCustomers(req, res, next));
router.get('/:id', (req, res, next) => customer_controller_1.customerController.getCustomerById(req, res, next));
router.patch('/:id', (req, res, next) => customer_controller_1.customerController.updateCustomer(req, res, next));
router.delete('/:id', (req, res, next) => customer_controller_1.customerController.deleteCustomer(req, res, next));
exports.default = router;
//# sourceMappingURL=customer.routes.js.map