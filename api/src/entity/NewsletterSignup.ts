import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class NewsletterSignup {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: number

}
