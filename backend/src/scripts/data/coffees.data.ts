import { MenuCategory } from '../../types/entities.types';

export interface CoffeeData {
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  isAvailable: boolean;
}

export const COFFEES: CoffeeData[] = [
  {
    name: 'Flat White',
    category: MenuCategory.Coffee,
    description: 'Velvety micro-foamed milk with rich espresso (must-have classic)',
    price: 180,
    isAvailable: true,
  },
  {
    name: 'Caffè Latte',
    category: MenuCategory.Coffee,
    description: 'Espresso with lots of steamed milk, mild and smooth',
    price: 160,
    isAvailable: true,
  },
  {
    name: 'Cappuccino',
    category: MenuCategory.Coffee,
    description: 'Equal parts espresso, steamed milk, and foam',
    price: 150,
    isAvailable: true,
  },
  {
    name: 'Americano',
    category: MenuCategory.Coffee,
    description: 'Espresso diluted with hot water; bold and clean',
    price: 140,
    isAvailable: true,
  },
  {
    name: 'Caffè Mocha',
    category: MenuCategory.Coffee,
    description: 'Espresso with chocolate syrup and steamed milk',
    price: 190,
    isAvailable: true,
  },
  {
    name: 'White Chocolate Mocha',
    category: MenuCategory.Coffee,
    description: 'Sweeter, creamier mocha variant',
    price: 210,
    isAvailable: true,
  },
  {
    name: 'Caramel Macchiato',
    category: MenuCategory.Coffee,
    description: 'Vanilla-flavored milk with espresso and caramel drizzle',
    price: 200,
    isAvailable: true,
  },
  {
    name: 'Espresso (Solo/Doppio)',
    category: MenuCategory.Coffee,
    description: 'Pure, intense coffee shot',
    price: 120,
    isAvailable: true,
  },
  {
    name: 'Cold Brew Coffee',
    category: MenuCategory.Coffee,
    description: 'Slow-steeped, smooth, low-acidity iced coffee',
    price: 170,
    isAvailable: true,
  },
  {
    name: 'Iced Latte',
    category: MenuCategory.Coffee,
    description: 'Chilled espresso with milk over ice',
    price: 165,
    isAvailable: true,
  },
];
