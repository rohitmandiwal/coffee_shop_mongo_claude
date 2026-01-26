import { ObjectId } from 'mongodb';
export declare enum MenuCategory {
    Coffee = "Coffee",
    Tea = "Tea",
    Pastry = "Pastry",
    Sandwich = "Sandwich",
    Dessert = "Dessert",
    Beverage = "Beverage"
}
export interface MenuItem {
    _id?: ObjectId;
    name: string;
    category: MenuCategory;
    description: string;
    price: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Customer {
    _id?: ObjectId;
    fullName: string;
    phone: string;
    email?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Order {
    _id?: ObjectId;
    customerId: ObjectId;
    items: OrderItem[];
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
export interface OrderItem {
    menuItemId: ObjectId;
    quantity: number;
    price: number;
}
//# sourceMappingURL=entities.types.d.ts.map