"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuCollection = getMenuCollection;
const database_1 = require("../config/database");
function getMenuCollection() {
    const db = (0, database_1.getDatabase)();
    return db.collection('menu_items');
}
//# sourceMappingURL=menu.model.js.map