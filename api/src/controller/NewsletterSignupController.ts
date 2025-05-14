import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { NewsletterSignup } from "../entity/NewsletterSignup";


export class NewsletterSignupController {
    private signupRepository = AppDataSource.getRepository(NewsletterSignup);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.signupRepository.find()
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, email } = request.body;
        const body = Object.assign(new NewsletterSignup(), {
            firstName,
            lastName, 
            email
        })

        return this.signupRepository.save(body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.signupRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.signupRepository.remove(userToRemove)

        return "user has been removed"
    }
}