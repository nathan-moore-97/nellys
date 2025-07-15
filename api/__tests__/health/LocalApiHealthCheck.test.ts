import { LocalApiHealthCheck } from "../../src/core/health/LocalApiHealthCheck";


describe('LocalApiHealthCheck', () => {
    let healthCheck: LocalApiHealthCheck;

    beforeEach(() => {
        healthCheck = new LocalApiHealthCheck();
    });

    test('should return ok', async () => {
        const result = await healthCheck.checkHealth();
        expect(result).toEqual(expect.objectContaining({
            service: 'nellys-api',
            status: 'OK'
        }))
    });
});