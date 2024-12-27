import { RequestHandler, Request, Response } from "express";
import { OTP } from "../Services/Otp";
import { sendOTP } from "../Services/Email";
import { User } from "../Schema/Schema";
import jwt from "jsonwebtoken"
import { JWT_SECRETE } from "../config/dotenv";


export const userGetOtpController: RequestHandler | any = async (req: Request, res: Response) => {
    console.log("reached here");

    const { username, email, password, fname, lname } = req.body;
    let otpInstance = OTP.getInstance();
    let otp: string | any = await otpInstance?.generateOTP(email);
    await sendOTP(email, otp)
    return res.status(200).json({
        msg: "Otp sent Succesfully !"
    })
}

export const userVerifyOtpController: RequestHandler | any = async (req: Request, res: Response) => {
    const { username, email, password, fname, lname, otp } = req.body;
    let otpInstance = OTP.getInstance();
    if (otpInstance?.validateOtp(email, otp)) {
        User.create({ email: email, fname: fname, lname: lname, password: password, username: username, freinds: [] }).then((res1) => {
            res.status(200).json({
                msg: "Account created Succesfully !"
            })
        }).catch((err) => {
            res.status(501).json({
                msg: "Account created Failed !"
            })
        })
    }
    else {
        res.status(501).json({
            msg: "Invalid OTP !"
        })
    }
}


export const userLoginController: RequestHandler | any = (req: Request, res: Response) => {
    const { username, password } = req.body;
    User.findOne({
        username: username
    }).then((res1) => {
        if (res1 != null) {
            if (res1.password == password) {
                let token = jwt.sign({ uid: res1._id }, JWT_SECRETE);
                res.cookie('token', token, { httpOnly: true, secure: false })
                return res.status(200).json({
                    msg: "Login Succesfull ! ",
                    token
                })
            }
            else {
                return res.status(501).json({
                    msg: "Password Mismatch  ! "
                })
            }
        }
        else {
            return res.status(404).json({
                msg: "User Not Found , Please register  ! "
            })
        }
    })
}