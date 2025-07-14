
import nodemailer from 'nodemailer';

import { smtpConfig } from '../config';
import { Email } from './EmailBuilder';
import logger from '../logging/Logger';

interface EmailerService {
    send(dest_addr: string, email: Email): Promise<void>;
}

const transporter = nodemailer.createTransport(smtpConfig);

export class GmailService implements EmailerService {
    async send(dest_addr: string, email: Email): Promise<void> {
        
        const mailOptions = {
            to: dest_addr,
            from: "nellysneedlers.com",
            subject: email.subject,
            html: email.body,
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                logger.error(err);
            } else {
                logger.debug(info.response);
            }
        });
    }
}



