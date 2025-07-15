import logger from "../../logging/Logger";

export interface HealthCheckResult {
    service: string;
    status: 'OK' | 'ERROR' | 'WARN';
    details?: string;
    timestamp: Date;
}

export interface HealthChecker {
    checkHealth(): Promise<HealthCheckResult>;
}

export class HealthCheckService {
    private readonly checks: HealthChecker[] = []

    register(check: HealthChecker) {
        this.checks.push(check);
        return this;
    }

    async checkAll(): Promise<HealthCheckResult[]> {

        logger.info("Health check started");
        const results: Promise<HealthCheckResult>[] = await this.checks.map(check => check.checkHealth());
        logger.info("Health check complete");

        return Promise.all(results);
    }
}