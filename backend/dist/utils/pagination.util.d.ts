import { PaginationMeta } from '../types/api.types';
export interface PaginationParams {
    page: number;
    limit: number;
}
export declare function parsePagination(page?: string | number, limit?: string | number): PaginationParams;
export declare function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta;
export declare function getSkip(page: number, limit: number): number;
//# sourceMappingURL=pagination.util.d.ts.map