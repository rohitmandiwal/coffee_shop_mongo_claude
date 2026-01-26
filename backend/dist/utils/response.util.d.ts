import { ApiResponse, PaginationMeta } from '../types/api.types';
export declare function success<T>(data: T, meta?: PaginationMeta): ApiResponse<T>;
export declare function error(errorMessage: string, meta?: PaginationMeta): ApiResponse<null>;
//# sourceMappingURL=response.util.d.ts.map