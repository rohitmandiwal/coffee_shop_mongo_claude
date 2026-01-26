"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_controller_1 = require("../controllers/menu.controller");
const router = (0, express_1.Router)();
router.post('/', (req, res, next) => menu_controller_1.menuController.createMenuItem(req, res, next));
router.get('/', (req, res, next) => menu_controller_1.menuController.getMenuItems(req, res, next));
router.get('/:id', (req, res, next) => menu_controller_1.menuController.getMenuItemById(req, res, next));
router.patch('/:id', (req, res, next) => menu_controller_1.menuController.updateMenuItem(req, res, next));
router.delete('/:id', (req, res, next) => menu_controller_1.menuController.deleteMenuItem(req, res, next));
router.patch('/:id/availability', (req, res, next) => menu_controller_1.menuController.toggleMenuItemAvailability(req, res, next));
exports.default = router;
//# sourceMappingURL=menu.routes.js.map