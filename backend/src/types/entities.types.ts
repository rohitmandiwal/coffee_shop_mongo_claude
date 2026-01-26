import { ObjectId } from 'mongodb';

export enum MenuCategory {
  Coffee = 'Coffee',
  Tea = 'Tea',
  Pastry = 'Pastry',
  Sandwich = 'Sandwich',
  Dessert = 'Dessert',
  Beverage = 'Beverage',
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

export enum OrderStatus {
  Created = 'Created',
  Paid = 'Paid',
}

export enum PaymentMode {
  Cash = 'Cash',
  UPI = 'UPI',
  Card = 'Card',
}

export interface Order {
  _id?: ObjectId;
  customerId: ObjectId;
  orderDate: Date;
  status: OrderStatus;

  items: OrderItem[];

  subTotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;

  paymentMode?: PaymentMode;

  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: ObjectId;
  itemNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  lineTotal: number;
}
