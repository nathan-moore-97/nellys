import { Request, Response, NextFunction } from "express";
import { AuthenticationService, TokenPayload } from "../core/auth/AuthenticationService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import logger from "../logging/Logger";
import { TokenExpiredError } from "jsonwebtoken";

const authService = new AuthenticationService(AppDataSource.getRepository(User));

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    try {
        if (token) {
            const tokenPayload = await authService.verify(token) as TokenPayload;
            
            if (!tokenPayload) {
                logger.warn("JWT Authentication failed");
                res.sendStatus(403);
                return;
            }

            logger.debug(`${tokenPayload.userId} ${tokenPayload.roleId} Authenticated`);

            (req as any).tokenPayload = tokenPayload;
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