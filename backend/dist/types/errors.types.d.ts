export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode: number, code?: string | undefined);
}
export declare class ValidationError extends AppError {
    details?: Record<string, string[]> | undefined;
    constructor(message: string, details?: Record<string, string[]> | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(message: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message: string);
}
//# sourceMappingURL=errors.types.d.ts.map