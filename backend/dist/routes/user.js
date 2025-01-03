"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userAuthController_1 = require("../Controller/userAuthController");
exports.router = express_1.default.Router();
exports.router.post('/get-otp', userAuthController_1.userGetOtpController);
exports.router.post('/verify-otp', userAuthController_1.userVerifyOtpController);
exports.router.post('/login', userAuthController_1.userLoginController);
