"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const errors_types_1 = require("../types/errors.types");
const response_util_1 = require("../utils/response.util");
const logger_util_1 = require("../utils/logger.util");
function errorHandler(err, req, res, next) {
    logger_util_1.logger.error('Error caught by error handler', err);
    if (err instanceof zod_1.ZodError) {
        const details = err.errors.reduce((acc, error) => {
            const path = error.path.join('.');
            if (!acc[path]) {
                acc[path] = [];
            }
            acc[path].push(error.message);
            return acc;
        }, {});
        const validation = new errors_types_1.ValidationError('Validation error', details);
        res.status(validation.statusCode).json((0, response_util_1.error)(validation.message));
        return;
    }
    if (err instanceof errors_types_1.AppError) {
        res.status(err.statusCode).json((0, response_util_1.error)(err.message));
        return;
    }
    if (err instanceof Error) {
        logger_util_1.logger.error('Unexpected error', err);
        res.status(500).json((0, response_util_1.error)('Internal server error'));
        return;
    }
    res.status(500).json((0, response_util_1.error)('Unknown error occurred'));
}
//# sourceMappingURL=errorHandler.middleware.js.map