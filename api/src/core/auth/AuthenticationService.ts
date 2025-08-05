import { Repository } from "typeorm";
import { User, UserRole } from "../../entity/User";
import jwt, { SignOptions } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("Secret values not set");
}

export interface AuthenticationPayload {
    userId: number;
    roleId: number;
}

interface AuthenticatedUser {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class AuthenticationService {
    
    constructor(private userRepo: Repository<User>) {}

    async users(): Promise<User[]> {
        return this.userRepo.find();
    }
    
    async user(username: string): Promise<User> {  
        return await this.userRepo.findOneBy({ username: username });
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
            { userId: user.id, roleId: user.roleId } as AuthenticationPayload,
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
        );

        const refresh = jwt.sign(
            { userId: user.id, roleId: user.roleId } as AuthenticationPayload,
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions
        );
        
        return {accessToken: token, refreshToken: refresh, user: user} as AuthenticatedUser;
    }

    async verify(token: string): Promise<AuthenticationPayload> {
        return jwt.verify(token, JWT_SECRET) as AuthenticationPayload;
    }

    async refresh(refreshToken: string): Promise<string | null> {
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as AuthenticationPayload;
            const user = await this.userRepo.findOneBy({id: payload.userId});

            if (!user) {
                return null;
            }

            const token = jwt.sign(
                { userId: user.id, roleId: user.roleId } as AuthenticationPayload,
                JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
            );

            return token;
        } catch (error) {
            return null;
        }
    }
}