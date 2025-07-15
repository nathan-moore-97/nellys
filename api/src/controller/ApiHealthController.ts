import { NextFunction, Request, Response } from "express";
import { HealthCheckService } from "../core/health/HealthCheckService";
import { LocalApiHealthCheck } from "../core/health/LocalApiHealthCheck";
import logger from "../logging/Logger";

export class ApiHealthController {
    private readonly healthService: HealthCheckService;

    constructor() {
        // TODO: Figure out some way to inject this
        this.healthService = new HealthCheckService()
            .register(new LocalApiHealthCheck());
    }
    
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return await this.healthService.checkAll();
        } catch (error) {
            logger.error(error);
            response.status(500).json({
                status: 'ERROR',
                error: 'Health check failed'
            });
        }
    }
}

