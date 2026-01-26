"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = exports.CustomerController = void 0;
const customer_service_1 = require("../services/customer.service");
const customer_schema_1 = require("../schemas/customer.schema");
const response_util_1 = require("../utils/response.util");
const pagination_util_1 = require("../utils/pagination.util");
class CustomerController {
    async createCustomer(req, res, next) {
        try {
            const input = customer_schema_1.createCustomerSchema.parse(req.body);
            const customer = await customer_service_1.customerService.createCustomer(input);
            res.status(201).json((0, response_util_1.success)(customer));
        }
        catch (error) {
            next(error);
        }
    }
    async getCustomers(req, res, next) {
        try {
            const input = customer_schema_1.customerFilterSchema.parse(req.query);
            const { items, total } = await customer_service_1.customerService.getCustomers(input);
            const meta = (0, pagination_util_1.buildPaginationMeta)(input.page, input.limit, total);
            res.json((0, response_util_1.success)(items, meta));
        }
        catch (error) {
            next(error);
        }
    }
    async getCustomerById(req, res, next) {
        try {
            const customer = await customer_service_1.customerService.getCustomerById(req.params.id);
            res.json((0, response_util_1.success)(customer));
        }
        catch (error) {
            next(error);
        }
    }
    async updateCustomer(req, res, next) {
        try {
            const input = customer_schema_1.updateCustomerSchema.parse(req.body);
            const customer = await customer_service_1.customerService.updateCustomer(req.params.id, input);
            res.json((0, response_util_1.success)(customer));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCustomer(req, res, next) {
        try {
            await customer_service_1.customerService.deleteCustomer(req.params.id);
            res.json((0, response_util_1.success)({ message: 'Customer deleted successfully' }));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CustomerController = CustomerController;
exports.customerController = new CustomerController();
//# sourceMappingURL=customer.controller.js.map