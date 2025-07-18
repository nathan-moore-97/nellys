import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AdminUser } from "../entity/AdminUser";
import { AuthenticationService } from "../core/auth/AuthenticationService";
import { strict } from "assert";
import logger from "../logging/Logger";

export class AuthenticationController {
    private authService: AuthenticationService =
        new AuthenticationService(AppDataSource.getRepository(AdminUser));
    
    async register(request: Request, response: Response, next: NextFunction) {
        try {
            const { username, password } = request.body;

            // Validate input
            if (!username || !password) {
                response.status(400).json({ 
                    error: 'Username and password are required' 
                });

                return;
            }

            if (await this.authService.userExists(username)) {
                response.status(400).json({
                    error: "Username already exists"
                });

                return;
            }

            const newUser = await this.authService.register(username, password);

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

    async authenticate(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body;

        if (!username || !password) {
            response.status(400).json({ 
                error: 'Username and password are required' 
            });

            return;
        }

        const {token, user} = await this.authService.authenticate(username, password);

        if (!token) {
            response.status(401).json({ error: "Invalid credentials"});
            return;
        }

        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
            path: '/'
        });

        const refreshToken = this.authService.refresh(user);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/auth/refresh', // Only sent to refresh endpoint
        });

        response.status(202).end();
    }
}
