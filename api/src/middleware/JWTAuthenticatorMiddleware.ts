import { Request, Response, NextFunction } from "express";
import { AuthenticationService } from "../core/auth/AuthenticationService";
import { AppDataSource } from "../data-source";
import { AdminUser } from "../entity/AdminUser";
import logger from "../logging/Logger";

const authService = new AuthenticationService(AppDataSource.getRepository(AdminUser));

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const user = await authService.verify(token);

        if (!user) {
            logger.warn("JWT Authentication failed");
            res.sendStatus(403);
            return;
        }

        (req as any).user = user;
        next();

    } else {
        logger.warn('Authentication attempt without token');
        res.sendStatus(401);
    }
}