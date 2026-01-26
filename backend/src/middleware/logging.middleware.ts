import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.util';

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    logger.info(
      `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
    return originalSend.call(this, data);
  };

  next();
}
