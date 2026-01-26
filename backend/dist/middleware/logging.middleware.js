"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = loggingMiddleware;
const logger_util_1 = require("../utils/logger.util");
function loggingMiddleware(req, res, next) {
    const startTime = Date.now();
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        logger_util_1.logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        return originalSend.call(this, data);
    };
    next();
}
//# sourceMappingURL=logging.middleware.js.map