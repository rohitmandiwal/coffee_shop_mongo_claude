"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerService = exports.CustomerService = void 0;
const customer_repository_1 = require("../repositories/customer.repository");
const errors_types_1 = require("../types/errors.types");
class CustomerService {
    async createCustomer(input) {
        const emailValue = input.email && input.email.trim() ? input.email : undefined;
        const notesValue = input.notes && input.notes.trim() ? input.notes : undefined;
        return customer_repository_1.customerRepository.create({
            fullName: input.fullName,
            phone: input.phone,
            email: emailValue,
            notes: notesValue,
        });
    }
    async getCustomers(input) {
        return customer_repository_1.customerRepository.findAll(input.page, input.limit, {
            search: input.search,
        });
    }
    async getCustomerById(id) {
        const customer = await customer_repository_1.customerRepository.findById(id);
        if (!customer) {
            throw new errors_types_1.NotFoundError(`Customer with id ${id} not found`);
        }
        return customer;
    }
    async updateCustomer(id, input) {
        const existingCustomer = await customer_repository_1.customerRepository.findById(id);
        if (!existingCustomer) {
            throw new errors_types_1.NotFoundError(`Customer with id ${id} not found`);
        }
        const emailValue = input.email && input.email.trim() ? input.email : undefined;
        const notesValue = input.notes && input.notes.trim() ? input.notes : undefined;
        const updated = await customer_repository_1.customerRepository.update(id, {
            ...input,
            email: emailValue,
            notes: notesValue,
        });
        if (!updated) {
            throw new errors_types_1.NotFoundError(`Customer with id ${id} not found`);
        }
        return updated;
    }
    async deleteCustomer(id) {
        const existingCustomer = await customer_repository_1.customerRepository.findById(id);
        if (!existingCustomer) {
            throw new errors_types_1.NotFoundError(`Customer with id ${id} not found`);
        }
        const deleted = await customer_repository_1.customerRepository.delete(id);
        if (!deleted) {
            throw new errors_types_1.NotFoundError(`Failed to delete customer with id ${id}`);
        }
    }
}
exports.CustomerService = CustomerService;
exports.customerService = new CustomerService();
//# sourceMappingURL=customer.service.js.map