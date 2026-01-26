"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
const currentLevel = levels[LOG_LEVEL] || 0;
exports.logger = {
    debug: (message, data) => {
        if (currentLevel <= levels.debug) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
    },
    info: (message, data) => {
        if (currentLevel <= levels.info) {
            console.log(`[INFO] ${message}`, data || '');
        }
    },
    warn: (message, data) => {
        if (currentLevel <= levels.warn) {
            console.warn(`[WARN] ${message}`, data || '');
        }
    },
    error: (message, data) => {
        if (currentLevel <= levels.error) {
            console.error(`[ERROR] ${message}`, data || '');
        }
    },
};
//# sourceMappingURL=logger.util.js.map