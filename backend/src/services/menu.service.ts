import { ObjectId } from 'mongodb';
import { menuRepository } from '../repositories/menu.repository';
import { MenuItem, MenuCategory } from '../types/entities.types';
import { NotFoundError } from '../types/errors.types';
import { CreateMenuItemInput, UpdateMenuItemInput, MenuFilterInput } from '../schemas/menu.schema';

export class MenuService {
  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    if (input.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
    return menuRepository.create({
      name: input.name,
      category: input.category,
      description: input.description,
      price: input.price,
      isAvailable: input.isAvailable,
    });
  }

  async getMenuItems(input: MenuFilterInput): Promise<{ items: MenuItem[]; total: number }> {
    const isAvailable = input.isAvailable === 'true' ? true : input.isAvailable === 'false' ? false : undefined;

    return menuRepository.findAll(input.page, input.limit, {
      search: input.search,
      category: input.category,
      isAvailable,
      minPrice: input.minPrice,
      maxPrice: input.maxPrice,
    });
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    const item = await menuRepository.findById(id);
    if (!item) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }
    return item;
  }

  async updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const existingItem = await menuRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }

    if (input.price !== undefined && input.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const updated = await menuRepository.update(id, input);
    if (!updated) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }
    return updated;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const existingItem = await menuRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }

    const deleted = await menuRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Failed to delete menu item with id ${id}`);
    }
  }

  async toggleMenuItemAvailability(id: string): Promise<MenuItem> {
    const existingItem = await menuRepository.findById(id);
    if (!existingItem) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }

    const updated = await menuRepository.toggleAvailability(id);
    if (!updated) {
      throw new NotFoundError(`Menu item with id ${id} not found`);
    }
    return updated;
  }
}

export const menuService = new MenuService();
