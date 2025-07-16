import { Repository } from "typeorm";
import { NewsletterSignupManager } from "../../src/newsletter/NewsletterSignupManager";
import { NewsletterSignup } from "../../src/entity/NewsletterSignup";

describe('NewsletterSignupManager', () => {
    let manager: NewsletterSignupManager;
    let mockedRepo: jest.Mocked<Repository<NewsletterSignup>>;
    let activeSignupEntry: NewsletterSignup;
    let inactiveSignupEntry: NewsletterSignup;

    beforeEach(() => {
        mockedRepo = {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<Repository<NewsletterSignup>>;
        manager = new NewsletterSignupManager(mockedRepo);

        activeSignupEntry = {
            email: 'helloworld@jest.com',
            firstName: 'Nathan', 
            lastName: 'Moore',
            greeting: 'This is for unit tests',
            isActive: true,
        } as NewsletterSignup;

        inactiveSignupEntry = {
            email: 'solongworld@jest.com',
            firstName: 'Nathan', 
            lastName: 'Moore',
            greeting: 'This is for unit tests',
            isActive: false,
        } as NewsletterSignup;
    });

    test('should return all users active or inactive', async () => {
        mockedRepo.find.mockResolvedValue([activeSignupEntry, inactiveSignupEntry]);

        const results = await manager.listAllSignups(); 
        expect(results.length).toBe(2);
    });

    test('should return no error with no found email', async () => {
        mockedRepo.findOneBy.mockResolvedValue(null);
        let { email, firstName, lastName, greeting } = activeSignupEntry;

        const {error, signup} = await manager.signupNewUser(firstName, lastName, email, greeting); 
        expect(error).toBe(null);
    });

    test('should return error with found email', async () => {
        mockedRepo.findOneBy.mockResolvedValue(activeSignupEntry);
        let { email, firstName, lastName, greeting } = activeSignupEntry;

        const {error, signup} = await manager.signupNewUser(firstName, lastName, email, greeting); 
        expect(error).toBe("Email already exists");
    });

    test('new values should override old values', async () => {
        mockedRepo.findOneBy.mockResolvedValue(inactiveSignupEntry);
        let { email, lastName, greeting } = inactiveSignupEntry;

        const {error, signup} = await manager.signupNewUser("Ryland", lastName, email, greeting);
        expect(signup.firstName).toBe("Ryland");
    });

    test('should return no error with inactive email', async () => {
        mockedRepo.findOneBy.mockResolvedValue(inactiveSignupEntry);
        let { email, firstName, lastName, greeting } = inactiveSignupEntry;

        const {error, signup} = await manager.signupNewUser(firstName, lastName, email, greeting); 
        expect(error).toBe(null);
    });

    test('inactive user should be active after signup', async () => {
        mockedRepo.findOneBy.mockResolvedValue(inactiveSignupEntry);
        let { email, firstName, lastName, greeting } = inactiveSignupEntry;

        const {error, signup} = await manager.signupNewUser(firstName, lastName, email, greeting); 
        expect(signup.isActive).toBe(true);
    });

    test('remove error when removing non existent user', async () => {
        mockedRepo.findOneBy.mockResolvedValue(null);
        let email = "helloworld@jest.com";
        let reason = "For unit tests";

        const { error, signup } = await manager.removeUser(email, reason);

        expect(error).toBe("Email does not exist");
    });

    test('remove active user should return inactive', async () => {
        mockedRepo.findOneBy.mockResolvedValue(activeSignupEntry);
        let email = "helloworld@jest.com";
        let reason = "For the unit test";

        const {error, signup} = await manager.removeUser(email, reason);

        expect(signup.isActive).toBe(false);
        expect(signup.cancellationReason).toBe(reason);
    });
});