
import { EMAIL_USER } from "../config/dotenv";
import { transporter } from "../config/nodemailer";


// Email sending function
export const sendOTP = async (to: string, otp: string) => {
    try {
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your OTP</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    padding: 20px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #2c3e50;
                }
                .otp {
                    font-size: 32px;
                    font-weight: bold;
                    color: #3498db;
                    letter-spacing: 5px;
                    margin: 20px 0;
                    text-align: center;
                }
                .description {
                    background-color: #e8f4fd;
                    border-left: 4px solid #3498db;
                    padding: 10px;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-top: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Your One-Time Password (OTP)</h1>
                <div class="description">
                    <p>You've requested an OTP for authentication. Please use the code below to complete your action:</p>
                </div>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for a short period. Do not share this code with anyone.</p>
                <p>If you didn't request this OTP, please ignore this email or contact our support team.</p>
                <div class="footer">
                    <p>This is an automated message, please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: EMAIL_USER, // Sender's email address
            to, // Recipient email
            subject: "OTP Validation",  // Subject line
            html: htmlContent, // HTML body
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};