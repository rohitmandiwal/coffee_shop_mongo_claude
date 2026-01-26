import { ObjectId } from 'mongodb';
import { MenuItem, MenuCategory } from '../types/entities.types';
export declare class MenuRepository {
    create(data: Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem>;
    findAll(page: number, limit: number, filters?: {
        search?: string;
        category?: MenuCategory;
        isAvailable?: boolean;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        items: MenuItem[];
        total: number;
    }>;
    findById(id: string | ObjectId): Promise<MenuItem | null>;
    update(id: string | ObjectId, data: Partial<MenuItem>): Promise<MenuItem | null>;
    delete(id: string | ObjectId): Promise<boolean>;
    toggleAvailability(id: string | ObjectId): Promise<MenuItem | null>;
}
export declare const menuRepository: MenuRepository;
//# sourceMappingURL=menu.repository.d.ts.map