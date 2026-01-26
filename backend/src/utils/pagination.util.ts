import { PaginationMeta } from '../types/api.types';

export interface PaginationParams {
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function parsePagination(
  page?: string | number,
  limit?: string | number
): PaginationParams {
  const parsedPage = Math.max(1, parseInt(String(page), 10) || DEFAULT_PAGE);
  const parsedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(String(limit), 10) || DEFAULT_LIMIT)
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
