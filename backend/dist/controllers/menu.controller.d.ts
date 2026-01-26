import { Request, Response, NextFunction } from 'express';
export declare class MenuController {
    createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMenuItems(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMenuItemById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteMenuItem(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleMenuItemAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const menuController: MenuController;
//# sourceMappingURL=menu.controller.d.ts.map