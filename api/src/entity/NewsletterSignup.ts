import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class NewsletterSignup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({nullable: true})
    greeting: string | null;

    @Column({default: true})
    isActive: boolean;

    @Column({nullable: true})
    cancellationReason: string;
}

