import { Admin, Repository } from "typeorm";
import { AdminUser } from "../../entity/AdminUser";
import jwt, { SignOptions } from "jsonwebtoken"
import logger from "../../logging/Logger";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || '1h';

export class AuthenticationService {
    
    constructor(private repo: Repository<AdminUser>) {}
    
    async userExists(username: string): Promise<boolean> {
        return await this.repo.findOneBy({ username }) != null;
    }

    async register(username: string, password: string): Promise<AdminUser> {
        const user = new AdminUser();
        user.username = username;
        await user.setPassword(password);
        return await this.repo.save(user);;
    }

    async authenticate(username: string, password: string): Promise<string> {
        const user = await this.repo.findOneBy({ username });

        if (!user) return null;
        if (!(await user.validatePassword(password))) return null;

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION_TIME } as SignOptions
        );
        
        return token;
    }

    async verify(token: string): Promise<string> {
        let username: string;

        jwt.verify(token, JWT_SECRET, (err: any, user: any) =>  {
            if (err) {
                logger.warn(err.message);
            }
            
            username = user;
        });

        return username;
    }
}