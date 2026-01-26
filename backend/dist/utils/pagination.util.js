"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
exports.buildPaginationMeta = buildPaginationMeta;
exports.getSkip = getSkip;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
function parsePagination(page, limit) {
    const parsedPage = Math.max(1, parseInt(String(page), 10) || DEFAULT_PAGE);
    const parsedLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(String(limit), 10) || DEFAULT_LIMIT));
    return {
        page: parsedPage,
        limit: parsedLimit,
    };
}
function buildPaginationMeta(page, limit, total) {
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
function getSkip(page, limit) {
    return (page - 1) * limit;
}
//# sourceMappingURL=pagination.util.js.map