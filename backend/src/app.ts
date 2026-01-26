import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/environment';
import { errorHandler } from './middleware/errorHandler.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import routes from './routes';
import { logger } from './utils/logger.util';

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(loggingMiddleware);

  // Routes
  app.use(routes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not found',
      timestamp: new Date().toISOString(),
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  logger.info(`Express app created with CORS origin: ${env.CORS_ORIGIN}`);
  return app;
}
