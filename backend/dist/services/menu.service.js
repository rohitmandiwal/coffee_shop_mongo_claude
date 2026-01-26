"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = exports.MenuService = void 0;
const menu_repository_1 = require("../repositories/menu.repository");
const errors_types_1 = require("../types/errors.types");
class MenuService {
    async createMenuItem(input) {
        if (input.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        return menu_repository_1.menuRepository.create({
            name: input.name,
            category: input.category,
            description: input.description,
            price: input.price,
            isAvailable: input.isAvailable,
        });
    }
    async getMenuItems(input) {
        const isAvailable = input.isAvailable === 'true' ? true : input.isAvailable === 'false' ? false : undefined;
        return menu_repository_1.menuRepository.findAll(input.page, input.limit, {
            search: input.search,
            category: input.category,
            isAvailable,
            minPrice: input.minPrice,
            maxPrice: input.maxPrice,
        });
    }
    async getMenuItemById(id) {
        const item = await menu_repository_1.menuRepository.findById(id);
        if (!item) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        return item;
    }
    async updateMenuItem(id, input) {
        const existingItem = await menu_repository_1.menuRepository.findById(id);
        if (!existingItem) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        if (input.price !== undefined && input.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        const updated = await menu_repository_1.menuRepository.update(id, input);
        if (!updated) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        return updated;
    }
    async deleteMenuItem(id) {
        const existingItem = await menu_repository_1.menuRepository.findById(id);
        if (!existingItem) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        const deleted = await menu_repository_1.menuRepository.delete(id);
        if (!deleted) {
            throw new errors_types_1.NotFoundError(`Failed to delete menu item with id ${id}`);
        }
    }
    async toggleMenuItemAvailability(id) {
        const existingItem = await menu_repository_1.menuRepository.findById(id);
        if (!existingItem) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        const updated = await menu_repository_1.menuRepository.toggleAvailability(id);
        if (!updated) {
            throw new errors_types_1.NotFoundError(`Menu item with id ${id} not found`);
        }
        return updated;
    }
}
exports.MenuService = MenuService;
exports.menuService = new MenuService();
//# sourceMappingURL=menu.service.js.map