"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderCollection = getOrderCollection;
const database_1 = require("../config/database");
function getOrderCollection() {
    return (0, database_1.getDatabase)().collection('orders');
}
//# sourceMappingURL=order.model.js.map