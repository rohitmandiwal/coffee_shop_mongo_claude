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

export enum PaymentStatus {
  Success = 'Success',
  CardDeclined = 'CardDeclined',
  InsufficientFunds = 'InsufficientFunds',
  CardLimitExceeded = 'CardLimitExceeded',
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
  transactionId?: ObjectId;

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

export interface Transaction {
  _id?: ObjectId;
  orderId?: ObjectId;
  customerId: ObjectId;
  amount: number;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  gatewayTransactionId: string;
  gatewayResponse: string;
  attemptedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopSellingItem {
  menuItemId: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostSoldCoffee {
  menuItemId: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostRegularCustomer {
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderCount: number;
  totalSpend: number;
}

export interface SalesSummaryItem {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface DashboardKPIs {
  todayOrders: number;
  todayRevenue: number;
  topSellingItemToday: TopSellingItem | null;
  mostRegularCustomerMTD: MostRegularCustomer | null;
}
