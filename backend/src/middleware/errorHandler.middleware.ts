import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../types/errors.types';
import { error } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export function errorHandler(
  err: Error | AppError | ZodError | unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('Error caught by error handler', err);

  if (err instanceof ZodError) {
    const details = err.errors.reduce((acc, error) => {
      const path = error.path.join('.');
      if (!acc[path]) {
        acc[path] = [];
      }
      acc[path].push(error.message);
      return acc;
    }, {} as Record<string, string[]>);

    const validation = new ValidationError('Validation error', details);
    res.status(validation.statusCode).json(error(validation.message));
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(error(err.message));
    return;
  }

  if (err instanceof Error) {
    logger.error('Unexpected error', err);
    res.status(500).json(error('Internal server error'));
    return;
  }

  res.status(500).json(error('Unknown error occurred'));
}
