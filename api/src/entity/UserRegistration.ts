import { ClientRequest } from "http";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRole } from "./User";

@Entity()
export class UserRegistration {
    @PrimaryColumn()
    token: string;

    @Column()
    email: string;

    @Column()
    roleId: UserRole.MEMBER | UserRole.BOARD | UserRole.ADMIN;

    @Column()
    registrarId: number;
}
