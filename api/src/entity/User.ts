import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

export enum UserRole {
    MEMBER = 1,
    BOARD = 2,
    ADMIN = 3,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    roleId: UserRole.MEMBER | UserRole.BOARD | UserRole.ADMIN;

    @Column({ unique: true })
    username: string

    @Column()
    passwordHash: string;

    @CreateDateColumn()
    createdAt: Date;

    async setPassword(password: string): Promise<void> {
        const saltRounds = 10;
        this.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.passwordHash);
    }
}