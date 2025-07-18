import { Repository } from "typeorm";
import { AdminUser } from "../../src/entity/AdminUser";
import { AuthenticationService } from "../../src/core/auth/AuthenticationService";

// Will need to update this method if the hashing library has changed
const isLikelyBcryptHash = (testStr: string): boolean => {
    const bcryptRegex = /^\$2[abyx]?\$\d{1,2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(testStr);
}

const isLikelyJWT = (testStr: string): boolean => {
    try {
        const parts = testStr.split('.');
        if (parts.length !== 3) return false;

        const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
        return header.typ === "JWT";
    } catch (e) {
        return false;
    }
}

describe('AuthenticationService', () => {
    
    let mockedRepo: jest.Mocked<Repository<AdminUser>>;
    let authService: AuthenticationService;
    
    beforeEach(() => {
        mockedRepo = {
            findOneBy: jest.fn(),
            save: jest.fn()
        } as unknown as jest.Mocked<Repository<AdminUser>>;

        authService = new AuthenticationService(mockedRepo);
    });

    test('should register a new user in the database', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user: AdminUser = await authService.register(username, password);
        expect(user).toEqual(expect.objectContaining({username: username}));
    });

    test('should not save passwords as plaintext', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user: AdminUser = await authService.register(username, password);
        expect(user.passwordHash === password).toBeFalsy();
    });

    test('should hash passwords', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user: AdminUser = await authService.register(username, password);
        expect(isLikelyBcryptHash(user.passwordHash)).toBeTruthy();
    });

    test('nonexistent credentials return null', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const token = await authService.authenticate(username, password);

        expect(token).toBeNull();
    });

    test('invalid credentials return null', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user = await authService.register(username, password);
        mockedRepo.findOneBy.mockResolvedValue(user);

        const token = await authService.authenticate(username, "notPassword");

        expect(token).toBeNull();
    });

    test('can authenticate a user', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user = await authService.register(username, password);
        mockedRepo.findOneBy.mockResolvedValue(user);

        const token = await authService.authenticate(username, password);

        expect(isLikelyJWT(token)).toBeTruthy();
    });

    test('after registration a user exists', async () => {
        const username: string = 'username';
        const password: string = 'password';

        const user = await authService.register(username, password);
        mockedRepo.findOneBy.mockResolvedValue(user);

        expect(await authService.userExists(username)).toBeTruthy();
    });
});