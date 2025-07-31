import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UserRegistration {
    @PrimaryColumn()
    token: string;
}
