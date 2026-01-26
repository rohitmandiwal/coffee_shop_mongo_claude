"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerCollection = getCustomerCollection;
const database_1 = require("../config/database");
function getCustomerCollection() {
    const db = (0, database_1.getDatabase)();
    return db.collection('customers');
}
//# sourceMappingURL=customer.model.js.map