"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.error = error;
function success(data, meta) {
    return {
        success: true,
        data,
        meta,
        timestamp: new Date().toISOString(),
    };
}
function error(errorMessage, meta) {
    return {
        success: false,
        error: errorMessage,
        meta,
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=response.util.js.map