import { Request, Response, NextFunction } from "express";
import { AuthenticationService } from "../core/auth/AuthenticationService";
import { AppDataSource } from "../data-source";
import { AdminUser } from "../entity/AdminUser";
import logger from "../logging/Logger";
import { TokenExpiredError } from "jsonwebtoken";

const authService = new AuthenticationService(AppDataSource.getRepository(AdminUser));

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    try {
        if (token) {
            const user = await authService.verify(token);
            
            if (!user) {
                logger.warn("JWT Authentication failed");
                res.sendStatus(403);
                return;
            }

            logger.info(`${user.userId} ${user.username} Authenticated`);

            (req as any).user = user;
            next();

        } else {
            logger.warn('Authentication attempt without token');
            res.sendStatus(401);
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.sendStatus(403);
        } else {
            res.sendStatus(401);
        }
    }
}