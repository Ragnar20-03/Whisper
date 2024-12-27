import dotenv from "dotenv"


dotenv.config();

export const PORT = process.env.PORT || 3000
export const MONGO_URL = process.env.MONGO_URL || " "

export const EMAIL_PASS = process.env.EMAIL_PASS || " "
export const EMAIL_USER = process.env.EMAIL_USER || " "
export const JWT_SECRETE = process.env.JWTSECRETE || " "

