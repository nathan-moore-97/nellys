import { Request, Response, NextFunction } from "express";
import { AuthenticationService } from "../core/auth/AuthenticationService";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";


export class AdminController {
    private authService: AuthenticationService =
        new AuthenticationService(AppDataSource.getRepository(User));

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await this.authService.users();
            
            const retUsers = users.map(u => {
                return {
                    id: u.id,
                    username: u.username,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    roleId: u.roleId,
                }
            });


            response.status(200).json(retUsers)
        } catch {
            response.status(500).json({error: "Something went wrong. Please try again later."});
            return;
        }
    }
}