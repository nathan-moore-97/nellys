import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity()
export class AdminUser {
    @PrimaryGeneratedColumn()
    id: number;

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