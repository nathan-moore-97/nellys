import logger from "../../logging/Logger";

export interface HealthCheckResult {
    service: string;
    status: 'OK' | 'ERROR' | 'WARN';
    details?: string;
    timestamp: Date;
}

export interface HealthChecker {
    service: string;
    checkHealth(): Promise<HealthCheckResult>;
}

export class HealthCheckService {
    private readonly checks: HealthChecker[] = []

    register(check: HealthChecker) {
        this.checks.push(check);
        return this;
    }

    async checkAll(): Promise<HealthCheckResult[]> {
        const results = await Promise.allSettled(
            this.checks.map(check => check.checkHealth())
        );

        return results.map((result, index) => {
            const service = this.checks[index].service;

            if (result.status === "fulfilled") {
                return result.value;
            } else {
                const error = result.reason;
                return {
                    service,
                    status: "ERROR",
                    details: error.message,
                    timestamp: new Date(),
                };
            }
        });
    }
}