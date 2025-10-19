import { Repository } from "typeorm";
import { User, UserRole } from "../../src/entity/User";
import { AuthenticationService } from "../../src/core/auth/AuthenticationService";
import { UserRegistration } from "../../src/entity/UserRegistration";

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
    
    let mockedUserRepo: jest.Mocked<Repository<User>>;
    let authService: AuthenticationService;
    let mockedRegistrationRepo: jest.Mocked<Repository<UserRegistration>>;
    
    beforeEach(() => {
        mockedUserRepo = {
            findOneBy: jest.fn(),
            save: jest.fn()
        } as unknown as jest.Mocked<Repository<User>>;

        mockedRegistrationRepo = {
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<Repository<UserRegistration>>;

        authService = new AuthenticationService(mockedUserRepo);
    });

    test('should register a new user in the database', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const user: User = await authService.register(username, password, roleId, firstName, lastName);
        expect(user).toEqual(expect.objectContaining({username: username}));
    });

    test('should not save passwords as plaintext', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const user: User = await authService.register(username, password, roleId, firstName, lastName);
        expect(user.passwordHash === password).toBeFalsy();
    });

    test('should hash passwords', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const user: User = await authService.register(username, password, roleId, firstName, lastName);
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
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const user = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(user);

        const token = await authService.authenticate(username, "notPassword");

        expect(token).toBeNull();
    });

    test('can authenticate a user', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const exUser = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(exUser);

        const {accessToken, refreshToken, user} = await authService.authenticate(username, password);

        expect(isLikelyJWT(accessToken)).toBeTruthy();
        expect(isLikelyJWT(refreshToken)).toBeTruthy();
        expect(user.id).toEqual(exUser.id);
    });

    test('after registration a user exists', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const user = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(user);

        expect(await authService.user(username)).toBeTruthy();
    });

    test('a token can be verified and contains id and role', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const exUser = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(exUser);

        const {accessToken, refreshToken, user} = await authService.authenticate(username, password);
        const payload = await authService.verify(accessToken);
    
        expect(payload.roleId).toEqual(roleId);
        expect(payload.userId).toEqual(exUser.id);
    });

    test('a token can be refreshed and contains id and role', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const exUser = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(exUser);

        const {accessToken, refreshToken, user} = await authService.authenticate(username, password);
        const token = await authService.refresh(refreshToken);
        const payload = await authService.verify(token);

        expect(payload.roleId).toEqual(roleId);
        expect(payload.userId).toEqual(exUser.id);
    });

    test('an invalid token cannot be refreshed', async () => {
        const token = await authService.refresh("BAD TOKEN");
        expect(token).toBeNull();
    });

    test('null token cannot be refreshed', async () => {
        const token = await authService.refresh(null);
        expect(token).toBeNull();
    });

    test('an authenticated users token cannot be used to refresh after they are removed from the database', async () => {
        const username: string = 'username';
        const password: string = 'password';
        const roleId: UserRole = UserRole.ADMIN;
        const firstName: string = 'Nathan';
        const lastName: string = 'Moore';

        const exUser = await authService.register(username, password, roleId, firstName, lastName);
        mockedUserRepo.findOneBy.mockResolvedValue(exUser);

        const {accessToken, refreshToken, user} = await authService.authenticate(username, password);
        mockedUserRepo.findOneBy.mockResolvedValue(null);

        const newAccessToken = await authService.refresh(refreshToken);
        expect(newAccessToken).toBeNull();
    });

    
});