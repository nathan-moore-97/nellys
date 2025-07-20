import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AdminUser } from "../entity/AdminUser";
import { AuthenticationService } from "../core/auth/AuthenticationService";
import { strict } from "assert";
import logger from "../logging/Logger";
import { error } from "console";

export class AuthenticationController {
    private authService: AuthenticationService =
        new AuthenticationService(AppDataSource.getRepository(AdminUser));

    // Middleware handles verifcation
    async verify (request: Request, response: Response, next: NextFunction) {
        response.status(202).end();
    }
    
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

        const {accessToken, refreshToken, user} = await this.authService.authenticate(username, password);
        
        if (!accessToken) {
            response.status(401).json({ error: "Invalid credentials"});
            return;
        }

        // TODO Save refresh token in database

        response.cookie('token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        logger.info(`ID=${user.id} USER=${user.username} New token pair issued`);
        response.status(202).end();
    }

    async clear(request: Request, response: Response, next: NextFunction) {
        
        // TODO clear refresh cookie from the database
        const user = (request as any).user;

        logger.info(`ID=${user.id} USER=${user.username} Logged out`);

        response.clearCookie('token');
        response.clearCookie('refreshToken');

        response.status(204).end();
    }

    async refreshToken(request: Request, response: Response, next: NextFunction) {
        const refreshToken = request.cookies?.refreshToken;

        if (!refreshToken) {
            response.status(401).json({error: "Refresh token required"});
            return;
        }

        const token = await this.authService.refresh(refreshToken);

        if (!token) {
            response.status(401).json({error: 'Invalid refresh token'});
            return;
        }

        response.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 1000,
        });

        response.status(202).end();
    }
}
