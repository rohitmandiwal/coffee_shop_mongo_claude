import { Request, Response, NextFunction } from 'express';
import { success } from '../utils/response.util';
import { checkDatabaseHealth } from '../config/database';

const startTime = Date.now();

export class HealthController {
  async check(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isDbHealthy = await checkDatabaseHealth();
      const uptime = (Date.now() - startTime) / 1000;

      res.json(
        success({
          status: isDbHealthy ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          database: isDbHealthy ? 'connected' : 'disconnected',
          uptime,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
