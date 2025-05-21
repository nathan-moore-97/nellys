import dotenv from "dotenv"
import SMTPTransport from "nodemailer/lib/smtp-transport"

dotenv.config();

export const smtpConfig: SMTPTransport.Options = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD,
    }, 
    secure: true,
}