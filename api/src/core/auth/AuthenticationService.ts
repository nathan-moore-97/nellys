import { Admin, DeleteResult, Repository } from "typeorm";
import { User, UserRole } from "../../entity/User";
import jwt, { SignOptions } from "jsonwebtoken"
import { UserRegistration } from "../../entity/UserRegistration";
import logger from "../../logging/Logger";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_REGISTRATION_SECRET = process.env.JWT_REGISTRATION_SECRET;

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';
const REGISTRATION_TOKEN_EXPIRATION = process.env.REGISTRATION_TOKEN_EXPIRATION || '15m';

if (!JWT_SECRET || !JWT_REFRESH_SECRET || !JWT_REGISTRATION_SECRET) {
    throw new Error("Secret values not set");
}

export interface TokenPayload {
    userId: number;
    roleId: number;
}

interface AuthenticatedUser {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class AuthenticationService {
    
    constructor(private userRepo: Repository<User>, 
        private regRepo: Repository<UserRegistration>) {}

    async users(): Promise<User[]> {
        return this.userRepo.find();
    }

    async pendingUsers(): Promise<UserRegistration[]> {
        return this.regRepo.find();
    }
    
    async user(username: string): Promise<User> {
        return await this.userRepo.findOneBy({ username: username });
    }

    async cleanupRegistrationToken(token: string): Promise<DeleteResult> {
        return await this.regRepo.delete({token: token}); 
    }

    async registrationToken(userId: number, newUserRole: UserRole): Promise<string> {
        const token = jwt.sign(
            { userId: userId, roleId: newUserRole } as TokenPayload,
            JWT_REGISTRATION_SECRET,
            { expiresIn: REGISTRATION_TOKEN_EXPIRATION } as SignOptions
        );

        const userReg = new UserRegistration();
        userReg.token = token

        this.regRepo.save(userReg);

        return token;
    }

    async verifyRegistrationToken(token: string): Promise<TokenPayload> {

        if (!token) return null;

        const dbToken = await this.regRepo.findOneBy({token: token});

        // Token should exist in the pending user registration table,
        // if it does not then the user has already used this token
        if (!dbToken) {
            logger.warn("Registration token could not be verified because it doesnt exist in the database.")
            return null;
        }

        return jwt.verify(token, JWT_REGISTRATION_SECRET) as TokenPayload;
    }

    async register(username: string, password: string, roleId: UserRole,
            firstName: string, lastName: string): Promise<User> {
        const user = new User();
        user.username = username;
        user.roleId = roleId;
        user.firstName = firstName;
        user.lastName = lastName;

        await user.setPassword(password);
        this.userRepo.save(user);
        
        return user;
    }

    async authenticate(username: string, password: string): Promise<AuthenticatedUser> {
        const user = await this.userRepo.findOneBy({ username });

        if (!user) return null;
        if (!(await user.validatePassword(password))) return null;

        const token = jwt.sign(
            { userId: user.id, roleId: user.roleId } as TokenPayload,
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
        );

        const refresh = jwt.sign(
            { userId: user.id, roleId: user.roleId } as TokenPayload,
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions
        );
        
        return {accessToken: token, refreshToken: refresh, user: user} as AuthenticatedUser;
    }

    async verify(token: string): Promise<TokenPayload> {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    }

    async refresh(refreshToken: string): Promise<string | null> {
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
            const user = await this.userRepo.findOneBy({id: payload.userId});

            if (!user) {
                return null;
            }

            const token = jwt.sign(
                { userId: user.id, roleId: user.roleId } as TokenPayload,
                JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
            );

            return token;
        } catch (error) {
            return null;
        }
    }
}