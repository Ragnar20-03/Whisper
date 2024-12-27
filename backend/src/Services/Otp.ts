import crypto from "crypto"

interface IUserOtp {
    email: string,
    otp: string,
    createdAt: number;
}
export class OTP {
    userOtps: IUserOtp[] = [];
    private static instance: OTP | null = null;

    constructor() {
        this.userOtps = [];
    }

    static getInstance() {
        if (!this.instance) {
            OTP.instance = new OTP();

        }
        return OTP.instance;
    }
    private checkExistingOtp = (otp: string) => {
        return this.userOtps.some(user => user.otp === otp);
    };

    private removeOtpForEmail = (email: string) => {
        this.userOtps = this.userOtps.filter(user => user.email !== email);
    };

    generateOTP = async (email: string) => {
        // Remove existing OTP for the email, if any
        this.removeOtpForEmail(email);

        let otp = crypto.randomBytes(3).toString('hex');

        // Keep generating OTPs until a unique one is found
        while (this.checkExistingOtp(otp)) {
            otp = crypto.randomBytes(3).toString('hex');
        }

        const currentTime = Date.now();
        this.userOtps.push({ email, otp, createdAt: currentTime });

        return otp;
    };
    validateOtp = (email: string, otp: string) => {
        const currentTime = Date.now();
        console.log("Otp'S Are : ", this.userOtps);

        const userOtp = this.userOtps.find(user => user.email === email && user.createdAt + (5 * 60 * 1000) > currentTime);

        if (!userOtp) {
            return false;
        }

        if (userOtp.otp !== otp) {
            return false;
        }

        // OTP is valid, remove it from the list (optional)
        this.userOtps = this.userOtps.filter(user => user.email !== email);

        return true;
    };
}