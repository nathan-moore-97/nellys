import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity()
export class NewsletterSignup {
    @PrimaryColumn()
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

