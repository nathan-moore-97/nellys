import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cors from "cors";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import { StorageServiceFactory } from "./gallery/ImageStorageService";
import cookieParser from "cookie-parser";
import logger from "./logging/Logger";
import { authenticateJWT } from "./middleware/JWTAuthenticatorMiddleware";
import { requireRoleLevel } from "./middleware/RoleValidatorMiddleware";

AppDataSource.initialize().then(async () => {

    dotenv.config();

    const app = express();
    const rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    });

    const speedLimiter = slowDown({
        windowMs: 15 * 60 * 1000,
        delayAfter: 25,
        delayMs: () => 2000,
    });

    app.use(cors({
        origin: process.env.WEB_APP_ROOT_URL, 
        credentials: true, 
    }));

    app.use(cookieParser());

    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {

        const middlewares = [];

        if (route.rateLimited) {
            middlewares.push(rateLimiter, speedLimiter);
        }

        // Must have a valid short lived token
        if (route.protected) {
            middlewares.push(authenticateJWT);
        }

        if (route.requires) {
            middlewares.push(requireRoleLevel(route.requires));
        }

        (app as any)[route.method](route.route, ...middlewares, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);

            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        })
    });
    
    StorageServiceFactory.Create().loadImages();
    
    app.listen(3000);
    logger.info("Server started at http://localhost:3000/");

}).catch(error => logger.error(error))
