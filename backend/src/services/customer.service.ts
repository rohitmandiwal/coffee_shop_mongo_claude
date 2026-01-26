import { ObjectId } from 'mongodb';
import { customerRepository } from '../repositories/customer.repository';
import { Customer } from '../types/entities.types';
import { NotFoundError } from '../types/errors.types';
import { CreateCustomerInput, UpdateCustomerInput, CustomerFilterInput } from '../schemas/customer.schema';

export class CustomerService {
  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const emailValue = input.email && input.email.trim() ? input.email : undefined;
    const notesValue = input.notes && input.notes.trim() ? input.notes : undefined;

    return customerRepository.create({
      fullName: input.fullName,
      phone: input.phone,
      email: emailValue,
      notes: notesValue,
    });
  }

  async getCustomers(input: CustomerFilterInput): Promise<{ items: Customer[]; total: number }> {
    return customerRepository.findAll(input.page, input.limit, {
      search: input.search,
    });
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer> {
    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundError(`Customer with id ${id} not found`);
    }

    const emailValue = input.email && input.email.trim() ? input.email : undefined;
    const notesValue = input.notes && input.notes.trim() ? input.notes : undefined;

    const updated = await customerRepository.update(id, {
      ...input,
      email: emailValue,
      notes: notesValue,
    });

    if (!updated) {
      throw new NotFoundError(`Customer with id ${id} not found`);
    }
    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    const existingCustomer = await customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundError(`Customer with id ${id} not found`);
    }

    const deleted = await customerRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Failed to delete customer with id ${id}`);
    }
  }
}

export const customerService = new CustomerService();
