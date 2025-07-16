import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { NewsletterSignup } from "../entity/NewsletterSignup";
import { GmailService } from "../email/EmailerService";
import { EmailDirector } from "../email/EmailBuilder";
import logger from "../logging/Logger";
import { NewsletterSignupManager } from "../newsletter/NewsletterSignupManager";

interface SignupResponse {
    error: string | null;
}

export class NewsletterSignupController {

    private emailer: GmailService = new GmailService();
    private manager: NewsletterSignupManager = 
        new NewsletterSignupManager(AppDataSource.getRepository(NewsletterSignup));

    async all(request: Request, response: Response, next: NextFunction) {
        return this.manager.listAllSignups();
    }

    async save(request: Request, response: Response, next: NextFunction) {

        const resp: SignupResponse = {
            error: null,
        };

        try {
            
            let { email, firstName, lastName, greeting } = request.body;

            const {error, signup} = await this.manager.signupNewUser(firstName,
                lastName, email, greeting);
            
            console.log(signup);

            if (!error) {
                // Send welcome email
                this.emailer.send(email, EmailDirector.welcome(signup));
                // Send email to Admin
                this.emailer.send(process.env.NEWSLETTER_ADMIN_EMAIL, EmailDirector.signUpNotification(signup));
            } else {
                resp.error = error;
            }
            
            response.json(resp);

        } catch (error) {
            logger.error(error)
            resp.error = "An unexpected error has occurred. Please try again later.";
            response.status(500).json(resp);
        }
    }

    async remove(request: Request, response: Response, next: NextFunction) {

        const resp: SignupResponse = {
            error: null,
        }

        try {
            const { email, reason } = request.body;
            const { error, signup } = await this.manager.removeUser(email, reason);

            if (!error) {
                // Send email to admin
                this.emailer.send(process.env.NEWSLETTER_ADMIN_EMAIL, EmailDirector.unsubscribeNotification(signup));
                // Send user email warning it may take a few days
                this.emailer.send(signup.email, EmailDirector.goodbye(signup));
            } else {
                resp.error = error;
            }
            
        } catch (error) {
            logger.error(error);
            resp.error = "An unexpected error occurred. Please try again later."
            response.status(500).json(resp);
        }

        response.json(resp);
    }
}

