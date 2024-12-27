"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRETE = exports.EMAIL_USER = exports.EMAIL_PASS = exports.MONGO_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.MONGO_URL = process.env.MONGO_URL || " ";
exports.EMAIL_PASS = process.env.EMAIL_PASS || " ";
exports.EMAIL_USER = process.env.EMAIL_USER || " ";
exports.JWT_SECRETE = process.env.JWTSECRETE || " ";
