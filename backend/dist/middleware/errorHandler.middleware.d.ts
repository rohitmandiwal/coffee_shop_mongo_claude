import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../types/errors.types';
export declare function errorHandler(err: Error | AppError | ZodError | unknown, req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=errorHandler.middleware.d.ts.map