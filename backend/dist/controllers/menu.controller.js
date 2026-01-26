"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = exports.MenuController = void 0;
const menu_service_1 = require("../services/menu.service");
const menu_schema_1 = require("../schemas/menu.schema");
const response_util_1 = require("../utils/response.util");
const pagination_util_1 = require("../utils/pagination.util");
class MenuController {
    async createMenuItem(req, res, next) {
        try {
            const input = menu_schema_1.createMenuItemSchema.parse(req.body);
            const item = await menu_service_1.menuService.createMenuItem(input);
            res.status(201).json((0, response_util_1.success)(item));
        }
        catch (error) {
            next(error);
        }
    }
    async getMenuItems(req, res, next) {
        try {
            const input = menu_schema_1.menuFilterSchema.parse(req.query);
            const { items, total } = await menu_service_1.menuService.getMenuItems(input);
            const meta = (0, pagination_util_1.buildPaginationMeta)(input.page, input.limit, total);
            res.json((0, response_util_1.success)(items, meta));
        }
        catch (error) {
            next(error);
        }
    }
    async getMenuItemById(req, res, next) {
        try {
            const item = await menu_service_1.menuService.getMenuItemById(req.params.id);
            res.json((0, response_util_1.success)(item));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMenuItem(req, res, next) {
        try {
            const input = menu_schema_1.updateMenuItemSchema.parse(req.body);
            const item = await menu_service_1.menuService.updateMenuItem(req.params.id, input);
            res.json((0, response_util_1.success)(item));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMenuItem(req, res, next) {
        try {
            await menu_service_1.menuService.deleteMenuItem(req.params.id);
            res.json((0, response_util_1.success)({ message: 'Menu item deleted successfully' }));
        }
        catch (error) {
            next(error);
        }
    }
    async toggleMenuItemAvailability(req, res, next) {
        try {
            const item = await menu_service_1.menuService.toggleMenuItemAvailability(req.params.id);
            res.json((0, response_util_1.success)(item));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MenuController = MenuController;
exports.menuController = new MenuController();
//# sourceMappingURL=menu.controller.js.map