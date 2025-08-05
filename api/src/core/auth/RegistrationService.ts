
import jwt, { SignOptions } from "jsonwebtoken"
import { UserRole } from "../../entity/User";
import { Repository } from "typeorm";
import { UserRegistration } from "../../entity/UserRegistration";

const REGISTRATION_TOKEN_EXPIRATION = process.env.REGISTRATION_TOKEN_EXPIRATION || '15m';

const JWT_REGISTRATION_SECRET = process.env.JWT_REGISTRATION_SECRET;

if (!JWT_REGISTRATION_SECRET) {
    throw new Error("Secret value not set");
}

export interface RegistrationPayload {
    registrarId: number;
    email: string;
    roleId: UserRole;
}

export class RegistrationService {
    constructor(private repo: Repository<UserRegistration>) {}
    
    async pendingUsers(): Promise<UserRegistration[]> {
        return this.repo.find();
    }
    
    async cleanupRegistrationToken(token: string): Promise<void> {
        this.repo.delete({token: token}); 
    }
    
    async registrationToken(userId: number, email: string, newUserRole: UserRole): Promise<string> {
        const token = jwt.sign(
            { registrarId: userId, email: email, roleId: newUserRole } as RegistrationPayload,
            JWT_REGISTRATION_SECRET,
            { expiresIn: REGISTRATION_TOKEN_EXPIRATION } as SignOptions
        );

        const userReg = new UserRegistration();
        userReg.token = token
        userReg.email = email;
        userReg.roleId = newUserRole;
        userReg.registrarId = userId;

        this.repo.save(userReg);

        return token;
    }

    async verifyRegistrationToken(token: string): Promise<RegistrationPayload> {

        if (!token) return null;

        const dbToken = await this.repo.findOneBy({token: token});

        // Token should exist in the pending user registration table,
        // if it does not then the user has already used this token
        if (!dbToken) {
            return null;
        }

        return jwt.verify(token, JWT_REGISTRATION_SECRET) as RegistrationPayload;
    }
}