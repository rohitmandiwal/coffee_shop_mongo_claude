import { Request, Response, NextFunction } from 'express';
export declare class CustomerController {
    createCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomerById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const customerController: CustomerController;
//# sourceMappingURL=customer.controller.d.ts.map