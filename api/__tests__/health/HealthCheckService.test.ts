import { HealthCheckService } from "../../src/core/health/HealthCheckService";
import { HealthChecker } from "../../src/core/health/HealthCheckService";

describe('HealthCheckService', () => {
    let service: HealthCheckService;

    const mockedHealthCheck: jest.Mocked<HealthChecker> = {
        checkHealth: jest.fn()
    }

    beforeEach(() => {
        service = new HealthCheckService();
    });

    test('should initialize with no checks', async () => {
        const results = await service.checkAll();
        expect(results.length).toBe(0);
    });

    test('should register new HealthCheckers', async () => {
        mockedHealthCheck.checkHealth.mockResolvedValue({
            service: 'MockService',
            status: 'OK',
            timestamp: new Date()
        });

        service.register(mockedHealthCheck);

        const results = await service.checkAll();

        expect(results).toContainEqual(expect.objectContaining({service: 'MockService'}));
    });
});