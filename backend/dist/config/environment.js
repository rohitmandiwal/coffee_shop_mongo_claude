"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    MONGO_URI: process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/coffee_shop?authSource=admin',
    JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};
//# sourceMappingURL=environment.js.map