"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_routes_1 = __importDefault(require("./menu.routes"));
const customer_routes_1 = __importDefault(require("./customer.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const health_routes_1 = __importDefault(require("./health.routes"));
const router = (0, express_1.Router)();
router.use('/health', health_routes_1.default);
router.use('/api/menu-items', menu_routes_1.default);
router.use('/api/customers', customer_routes_1.default);
router.use('/api/orders', order_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map