import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { NewsletterSignup } from "../entity/NewsletterSignup";
import { GmailService } from "../email/EmailerService";
import { EmailDirector } from "../email/EmailBuilder";
import logger from "../logging/Logger";

interface SignupResponse {
    error: string | null;
}

export class NewsletterSignupController {

    private signupRepository = AppDataSource.getRepository(NewsletterSignup);
    private emailer: GmailService = new GmailService();

    async all(request: Request, response: Response, next: NextFunction) {
        return this.signupRepository.find();
    }

    async save(request: Request, response: Response, next: NextFunction) {

        const resp: SignupResponse = {
            error: null,
        };

        try {
            let signedUp: boolean = false;

            const { firstName, lastName, email, greeting } = request.body;
            
            const signup = new NewsletterSignup();
            signup.firstName = firstName;
            signup.lastName = lastName;
            signup.email = email;
            signup.greeting = greeting;

            let user = await this.signupRepository.findOneBy({ email });

            if (user) {
                if (user.isActive) {
                    resp.error = "Email already exists.";
                } else {
                    user.isActive = true;
                    user.cancellationReason = null;
                    user.greeting = signup.greeting;
                    user.firstName = signup.firstName;
                    user.lastName = signup.lastName;
                    signedUp = true;
                    await this.signupRepository.save(user);
                }
            } else {
                await this.signupRepository.save(signup);
                signedUp = true;
            }

            if (signedUp) {
                // Send welcome email
                this.emailer.send(signup.email, EmailDirector.welcome(signup));
                // Send email to Admin
                this.emailer.send(process.env.NEWSLETTER_ADMIN_EMAIL, EmailDirector.signUpNotification(signup));
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

            let userToRemove = await this.signupRepository.findOneBy({ email });

            if (!userToRemove) {
                resp.error = "Email does not exist.";
            } else {
                userToRemove.isActive = false;
                userToRemove.cancellationReason = reason;

                await this.signupRepository.save(userToRemove);

                // Send email to admin
                this.emailer.send(process.env.NEWSLETTER_ADMIN_EMAIL, EmailDirector.unsubscribeNotification(userToRemove));
                // Send user email warning it may take a few days
                this.emailer.send(userToRemove.email, EmailDirector.goodbye(userToRemove));
            }
            
        } catch (error) {
            logger.error(error);
            resp.error = "An unexpected error occurred. Please try again later."
            response.status(500).json(resp);
        }

        response.json(resp);
    }
}

