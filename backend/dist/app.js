"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const logging_middleware_1 = require("./middleware/logging.middleware");
const routes_1 = __importDefault(require("./routes"));
const logger_util_1 = require("./utils/logger.util");
function createApp() {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)());
    // CORS
    app.use((0, cors_1.default)({
        origin: environment_1.env.CORS_ORIGIN,
        credentials: true,
    }));
    // Body parser
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Logging
    app.use(logging_middleware_1.loggingMiddleware);
    // Routes
    app.use(routes_1.default);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: 'Not found',
            timestamp: new Date().toISOString(),
        });
    });
    // Error handler (must be last)
    app.use(errorHandler_middleware_1.errorHandler);
    logger_util_1.logger.info(`Express app created with CORS origin: ${environment_1.env.CORS_ORIGIN}`);
    return app;
}
//# sourceMappingURL=app.js.map