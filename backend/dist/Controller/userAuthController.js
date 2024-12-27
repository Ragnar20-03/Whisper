"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginController = exports.userVerifyOtpController = exports.userGetOtpController = void 0;
const Otp_1 = require("../Services/Otp");
const Email_1 = require("../Services/Email");
const Schema_1 = require("../Schema/Schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("../config/dotenv");
const userGetOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("reached here");
    const { username, email, password, fname, lname } = req.body;
    let otpInstance = Otp_1.OTP.getInstance();
    let otp = yield (otpInstance === null || otpInstance === void 0 ? void 0 : otpInstance.generateOTP(email));
    yield (0, Email_1.sendOTP)(email, otp);
    return res.status(200).json({
        msg: "Otp sent Succesfully !"
    });
});
exports.userGetOtpController = userGetOtpController;
const userVerifyOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, fname, lname, otp } = req.body;
    let otpInstance = Otp_1.OTP.getInstance();
    if (otpInstance === null || otpInstance === void 0 ? void 0 : otpInstance.validateOtp(email, otp)) {
        Schema_1.User.create({ email: email, fname: fname, lname: lname, password: password, username: username, freinds: [] }).then((res1) => {
            res.status(200).json({
                msg: "Account created Succesfully !"
            });
        }).catch((err) => {
            res.status(501).json({
                msg: "Account created Failed !"
            });
        });
    }
    else {
        res.status(501).json({
            msg: "Invalid OTP !"
        });
    }
});
exports.userVerifyOtpController = userVerifyOtpController;
const userLoginController = (req, res) => {
    const { username, password } = req.body;
    Schema_1.User.findOne({
        username: username
    }).then((res1) => {
        if (res1 != null) {
            if (res1.password == password) {
                let token = jsonwebtoken_1.default.sign({ uid: res1._id }, dotenv_1.JWT_SECRETE);
                res.cookie('token', token, { httpOnly: true, secure: false });
                return res.status(200).json({
                    msg: "Login Succesfull ! ",
                    token
                });
            }
            else {
                return res.status(501).json({
                    msg: "Password Mismatch  ! "
                });
            }
        }
        else {
            return res.status(404).json({
                msg: "User Not Found , Please register  ! "
            });
        }
    });
};
exports.userLoginController = userLoginController;
