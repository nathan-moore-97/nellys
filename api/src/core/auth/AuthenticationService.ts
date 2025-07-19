import { Admin, Repository } from "typeorm";
import { AdminUser } from "../../entity/AdminUser";
import jwt, { SignOptions } from "jsonwebtoken"
import logger from "../../logging/Logger";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

interface TokenPayload {
    userId: number;
    username: string;
}

interface AuthenticatedUser {
    accessToken: string;
    refreshToken: string;
    user: AdminUser;
}

export class AuthenticationService {
    
    constructor(private repo: Repository<AdminUser>) {}
    
    async userExists(username: string): Promise<boolean> {
        return await this.repo.findOneBy({ username }) != null;
    }

    async register(username: string, password: string): Promise<AdminUser> {
        const user = new AdminUser();
        user.username = username;
        await user.setPassword(password);
        this.repo.save(user);
        return user;
    }

    async authenticate(username: string, password: string): Promise<AuthenticatedUser> {
        const user = await this.repo.findOneBy({ username });

        if (!user) return null;
        if (!(await user.validatePassword(password))) return null;

        const token = jwt.sign(
            { userId: user.id, username: user.username } as TokenPayload,
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
        );

        const refresh = jwt.sign(
            { userId: user.id, username: user.username } as TokenPayload,
            JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions
        );
        
        return {accessToken: token, refreshToken: refresh, user: user} as AuthenticatedUser;
    }

    async verify(token: string): Promise<TokenPayload> {
        let username: string;

        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    }

    async refresh(refreshToken: string): Promise<string | null> {
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
            const user = await this.repo.findOneBy({id: payload.userId});

            if (!user) {
                return null;
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username } as TokenPayload,
                JWT_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions
            );

            return token;
        } catch (error) {
            logger.warn('Refresh token verifcation failed:', error);
            return null;
        }
    }
}