import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User"
import { AuthenticationService } from "../core/auth/AuthenticationService";
import logger, { logAsync } from "../logging/Logger";

export class AuthenticationController {
    private authService: AuthenticationService =
        new AuthenticationService(AppDataSource.getRepository(User));
    
    async register(request: Request, response: Response, next: NextFunction) {
        try {
            const { username, password, roleId, firstName, lastName } = request.body;

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

            const newUser = await this.authService.register(username, password, roleId, firstName, lastName);

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

        try {
            const {accessToken, refreshToken, user} = await this.authService.authenticate(username, password);
            if (!accessToken) {
                response.status(401).json({ error: "Invalid credentials"});
                return;
            }
            
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

            response.status(202).json({
                username: user.username,
                roleId: user.roleId,
                firstName: user.firstName,
                lastName: user.lastName,
            });

        } catch (error) {
            response.status(401).json({ error: "Invalid credentials"});
        }
    }

    async clear(request: Request, response: Response, next: NextFunction) {
        
        // TODO clear refresh cookie from the database
        const user = (request as any).user;

        response.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,       
            sameSite: 'strict',  
            path: '/auth/refresh',
        });

        response.status(204).end();
    }

    async refreshToken(request: Request, response: Response, next: NextFunction) {
        const refreshToken = request.cookies?.refreshToken;

        logger.debug("Refresh token requested");

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
            maxAge: 15 * 60 * 1000,
        });

        response.status(202).end();
    }
}
