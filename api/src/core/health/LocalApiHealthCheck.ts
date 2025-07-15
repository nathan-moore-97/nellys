import { HealthChecker, HealthCheckResult } from "./HealthCheckService";


export class LocalApiHealthCheck implements HealthChecker {
    async checkHealth(): Promise<HealthCheckResult> {
        return {
            service: 'nellys-api',
            status: 'OK',
            timestamp: new Date()
        } as HealthCheckResult;
    }
}