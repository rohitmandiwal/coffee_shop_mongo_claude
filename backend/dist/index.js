"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const environment_1 = require("./config/environment");
const database_1 = require("./config/database");
const logger_util_1 = require("./utils/logger.util");
async function start() {
    try {
        logger_util_1.logger.info('Starting Coffee Shop Management Backend...');
        logger_util_1.logger.info(`Environment: ${environment_1.env.NODE_ENV}`);
        // Connect to database
        await (0, database_1.connectDatabase)();
        // Create Express app
        const app = (0, app_1.createApp)();
        // Start server
        const server = app.listen(environment_1.env.PORT, () => {
            logger_util_1.logger.info(`Server running on http://localhost:${environment_1.env.PORT}`);
            logger_util_1.logger.info(`Health check: http://localhost:${environment_1.env.PORT}/health`);
            logger_util_1.logger.info(`Menu API: http://localhost:${environment_1.env.PORT}/api/menu-items`);
            logger_util_1.logger.info(`Customers API: http://localhost:${environment_1.env.PORT}/api/customers`);
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger_util_1.logger.info('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                logger_util_1.logger.info('HTTP server closed');
                await (0, database_1.disconnectDatabase)();
                process.exit(0);
            });
        });
        process.on('SIGINT', async () => {
            logger_util_1.logger.info('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                logger_util_1.logger.info('HTTP server closed');
                await (0, database_1.disconnectDatabase)();
                process.exit(0);
            });
        });
    }
    catch (error) {
        logger_util_1.logger.error('Failed to start server', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=index.js.map