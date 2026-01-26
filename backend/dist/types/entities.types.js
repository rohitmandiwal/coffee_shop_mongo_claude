"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMode = exports.OrderStatus = exports.MenuCategory = void 0;
var MenuCategory;
(function (MenuCategory) {
    MenuCategory["Coffee"] = "Coffee";
    MenuCategory["Tea"] = "Tea";
    MenuCategory["Pastry"] = "Pastry";
    MenuCategory["Sandwich"] = "Sandwich";
    MenuCategory["Dessert"] = "Dessert";
    MenuCategory["Beverage"] = "Beverage";
})(MenuCategory || (exports.MenuCategory = MenuCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "Created";
    OrderStatus["Paid"] = "Paid";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMode;
(function (PaymentMode) {
    PaymentMode["Cash"] = "Cash";
    PaymentMode["UPI"] = "UPI";
    PaymentMode["Card"] = "Card";
})(PaymentMode || (exports.PaymentMode = PaymentMode = {}));
//# sourceMappingURL=entities.types.js.map