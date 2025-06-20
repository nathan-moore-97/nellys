import { NextFunction, Request, Response } from "express";

interface HealthResponse {
    status: string;
}

export class ApiHealthController {
    async all(request: Request, response: Response, next: NextFunction) {
        response.json({
            status: "OK"
        } as HealthResponse);
    }
}

