import { Customer } from '../types/entities.types';
import { CreateCustomerInput, UpdateCustomerInput, CustomerFilterInput } from '../schemas/customer.schema';
export declare class CustomerService {
    createCustomer(input: CreateCustomerInput): Promise<Customer>;
    getCustomers(input: CustomerFilterInput): Promise<{
        items: Customer[];
        total: number;
    }>;
    getCustomerById(id: string): Promise<Customer>;
    updateCustomer(id: string, input: UpdateCustomerInput): Promise<Customer>;
    deleteCustomer(id: string): Promise<void>;
}
export declare const customerService: CustomerService;
//# sourceMappingURL=customer.service.d.ts.map