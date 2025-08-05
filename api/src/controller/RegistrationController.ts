import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { GmailService } from "../email/EmailerService";
import { EmailDirector } from "../email/EmailBuilder";
import { UserRegistration } from "../entity/UserRegistration";
import { RegistrationPayload, RegistrationService } from "../core/auth/RegistrationService";
import { AuthenticationService, AuthenticationPayload } from "../core/auth/AuthenticationService";
import { User } from "../entity/User";

export class RegistrationController {
    private emailer: GmailService = new GmailService();
    private registrationService: RegistrationService =
        new RegistrationService(AppDataSource.getRepository(UserRegistration));
    private authService: AuthenticationService =
        new AuthenticationService(AppDataSource.getRepository(User));
    

    async verifyRegistrationToken(request: Request, response: Response, next: NextFunction) {
        try {
            const { token } = request.body;

            if (!token) {
                response.sendStatus(403);
                return;
            }

            if (!(await this.registrationService.verifyRegistrationToken(token))) {
                response.sendStatus(403);
                return;
            }
            
            response.sendStatus(200);
            return;

        } catch(error) {
            response.status(500).json({error: "Something went wrong. Please try again later."});
            return;
        }
    }

    async createRegistrationToken(request: Request, response: Response, next: NextFunction) {
        
        try {
            const tokenPayload = (request as any).tokenPayload as AuthenticationPayload;
            const { email, roleId } = request.body;

            const token = await this.registrationService.registrationToken(tokenPayload.userId, email, roleId);
            this.emailer.send(email, EmailDirector.registrationEmail(token));

            response.sendStatus(200);
            return;

        } catch {
            response.status(500).json({error: "Something went wrong. Please try again later."});
            return;
        }
    }
    
    async register(request: Request, response: Response, next: NextFunction) {
        try {

            const { data, token } = request.body;
            const { username, password, firstName, lastName } = data;

            const payload = await this.registrationService.verifyRegistrationToken(token);

            if (!payload) {
                response.status(403).json({
                    error: "Invalid registration token"
                });

                return;
            }

            // Validate input
            if (!username || !password) {
                response.status(400).json({ 
                    error: 'Username and password are required' 
                });

                return;
            }

            // Does this user have an active account? 
            if (await this.authService.user(username)) {
                response.status(400).json({
                    error: "Username already exists"
                });

                return;
            }

            // Create a user account
            const newUser = await this.authService.register(username, password, payload.roleId, firstName, lastName);
            // Invalidate the registration token so the user cannot use it twice
            this.registrationService.cleanupRegistrationToken(token);

            response.status(201).json({
                id: newUser.id,
                username: newUser.username,
                createdAt: newUser.createdAt,
            });

        } catch {
            response.status(500).json({error: "Something went wrong. Please try again later."});
            return;
        }
    }

    
}
