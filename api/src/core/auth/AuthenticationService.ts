import { Admin, Repository } from "typeorm";
import { AdminUser } from "../../entity/AdminUser";
import jwt, { SignOptions } from "jsonwebtoken"
import logger from "../../logging/Logger";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '1h';

interface TokenPayload {
    userId: number;
    username: string;
}

interface AuthenticatedUser {
    token: string;
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
            { expiresIn: JWT_EXPIRATION_TIME } as SignOptions
        );
        
        return {token: token, user: user} as AuthenticatedUser;
    }

    async verify(token: string): Promise<string> {
        let username: string;

        jwt.verify(token, JWT_SECRET, (err: any, user: any) =>  {
            if (err) {
                logger.warn(err.message);
                return null;
            }

            username = user;
        });

        return username;
    }

    async refresh(user: AdminUser): Promise<string> {
        return jwt.sign(
            { userId: user.id, username: user.username } as TokenPayload,
            JWT_REFRESH_SECRET,
            { expiresIn: JWT_EXPIRATION_TIME } as SignOptions
        )
    }
}