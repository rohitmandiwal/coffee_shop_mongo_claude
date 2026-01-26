export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: PaginationMeta;
    timestamp: string;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
//# sourceMappingURL=api.types.d.ts.map