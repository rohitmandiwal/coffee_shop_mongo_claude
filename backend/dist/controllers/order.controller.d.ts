import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
    getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomerOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const orderController: OrderController;
//# sourceMappingURL=order.controller.d.ts.map