import { Request, Response, NextFunction } from 'express';
import { menuService } from '../services/menu.service';
import { createMenuItemSchema, updateMenuItemSchema, menuFilterSchema } from '../schemas/menu.schema';
import { success } from '../utils/response.util';
import { buildPaginationMeta } from '../utils/pagination.util';

export class MenuController {
  async createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = createMenuItemSchema.parse(req.body);
      const item = await menuService.createMenuItem(input);
      res.status(201).json(success(item));
    } catch (error) {
      next(error);
    }
  }

  async getMenuItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = menuFilterSchema.parse(req.query);
      const { items, total } = await menuService.getMenuItems(input);
      const meta = buildPaginationMeta(input.page, input.limit, total);
      res.json(success(items, meta));
    } catch (error) {
      next(error);
    }
  }

  async getMenuItemById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuService.getMenuItemById(req.params.id);
      res.json(success(item));
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = updateMenuItemSchema.parse(req.body);
      const item = await menuService.updateMenuItem(req.params.id, input);
      res.json(success(item));
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await menuService.deleteMenuItem(req.params.id);
      res.json(success({ message: 'Menu item deleted successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async toggleMenuItemAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await menuService.toggleMenuItemAvailability(req.params.id);
      res.json(success(item));
    } catch (error) {
      next(error);
    }
  }
}

export const menuController = new MenuController();
