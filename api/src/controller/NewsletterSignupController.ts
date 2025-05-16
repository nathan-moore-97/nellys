import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { NewsletterSignup } from "../entity/NewsletterSignup";
import { EmailerService } from "../services/EmailerService";

interface SignupResponse {
    error: string | null;
}

export class NewsletterSignupController {

    private signupRepository = AppDataSource.getRepository(NewsletterSignup);
    private email: EmailerService = new EmailerService();

    async all(request: Request, response: Response, next: NextFunction) {
        return this.signupRepository.find();
    }

    async save(request: Request, response: Response, next: NextFunction) {

        const resp: SignupResponse = {
            error: null,
        };

        try {
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

                    await this.signupRepository.save(user);
                }
            } else {
                await this.signupRepository.save(signup);
            }

            // Send welcome email
            this.email.send(signup.email, `Welcome, ${signup.firstName}!`);
            // Send email to Admin
            this.email.send(process.env.NEWSLETTER_ADMIN_EMAIL, `${signup.email} has subscribed.`);

            response.json(resp);
            

        } catch (error) {
            console.error(error)
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
                this.email.send(process.env.NEWSLETTER_ADMIN_EMAIL, `${userToRemove.email} has unsubscribed.`);
            }
            
        } catch (error) {
            console.error(error);
            resp.error = "An unexpected error occurred. Please try again later."
            response.status(500).json(resp);
        }

        response.json(resp);
    }
}

