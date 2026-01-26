"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = exports.HealthController = void 0;
const response_util_1 = require("../utils/response.util");
const database_1 = require("../config/database");
const startTime = Date.now();
class HealthController {
    async check(req, res, next) {
        try {
            const isDbHealthy = await (0, database_1.checkDatabaseHealth)();
            const uptime = (Date.now() - startTime) / 1000;
            res.json((0, response_util_1.success)({
                status: isDbHealthy ? 'healthy' : 'unhealthy',
                timestamp: new Date().toISOString(),
                database: isDbHealthy ? 'connected' : 'disconnected',
                uptime,
            }));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.HealthController = HealthController;
exports.healthController = new HealthController();
//# sourceMappingURL=health.controller.js.map