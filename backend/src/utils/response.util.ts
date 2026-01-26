import { ApiResponse, PaginationMeta } from '../types/api.types';

export function success<T>(
  data: T,
  meta?: PaginationMeta
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
    timestamp: new Date().toISOString(),
  };
}

export function error(
  errorMessage: string,
  meta?: PaginationMeta
): ApiResponse<null> {
  return {
    success: false,
    error: errorMessage,
    meta,
    timestamp: new Date().toISOString(),
  };
}
