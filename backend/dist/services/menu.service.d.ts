import { MenuItem } from '../types/entities.types';
import { CreateMenuItemInput, UpdateMenuItemInput, MenuFilterInput } from '../schemas/menu.schema';
export declare class MenuService {
    createMenuItem(input: CreateMenuItemInput): Promise<MenuItem>;
    getMenuItems(input: MenuFilterInput): Promise<{
        items: MenuItem[];
        total: number;
    }>;
    getMenuItemById(id: string): Promise<MenuItem>;
    updateMenuItem(id: string, input: UpdateMenuItemInput): Promise<MenuItem>;
    deleteMenuItem(id: string): Promise<void>;
    toggleMenuItemAvailability(id: string): Promise<MenuItem>;
}
export declare const menuService: MenuService;
//# sourceMappingURL=menu.service.d.ts.map