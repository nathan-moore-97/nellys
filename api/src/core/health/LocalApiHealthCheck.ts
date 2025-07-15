import { HealthChecker, HealthCheckResult } from "./HealthCheckService";


export class LocalApiHealthCheck implements HealthChecker {
    service = 'nellys-api';

    async checkHealth(): Promise<HealthCheckResult> {
        return {
            service: this.service,
            status: 'OK',
            timestamp: new Date()
        } as HealthCheckResult;
    }
}