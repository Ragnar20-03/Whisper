import express, { Request, Response } from "express";
import { userGetOtpController, userLoginController, userVerifyOtpController } from "../Controller/userAuthController";
import { OTP } from "../Services/Otp";
import { sendOTP } from "../Services/Email";
export const router = express.Router();

router.post('/get-otp', userGetOtpController)

router.post('/verify-otp', userVerifyOtpController)

router.post('/login', userLoginController)
