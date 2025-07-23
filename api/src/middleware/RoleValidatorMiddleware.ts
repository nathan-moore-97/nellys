import { Request, Response, NextFunction } from "express";
import { User, UserRole } from "../entity/User";
import logger from "../logging/Logger";
import { TokenPayload } from "../core/auth/AuthenticationService";

export function requireRoleLevel(minimumLevel: UserRole) {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenPayload = (req as any).tokenPayload as TokenPayload;

        logger.debug(JSON.stringify(tokenPayload));

        if (!tokenPayload) {
            res.sendStatus(401);
            return;
        }

        if (tokenPayload.roleId < minimumLevel) {
            res.sendStatus(403);
            return;
        }

        logger.debug(`REQ_ROLE: ${minimumLevel} ROLE_PROV: ${tokenPayload.roleId}`);
        next();
    }
}