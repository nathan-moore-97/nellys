import { Repository } from "typeorm";
import { NewsletterSignup } from "../entity/NewsletterSignup";

export class NewsletterSignupManager {
    constructor(private repo: Repository<NewsletterSignup>) {}

    async listAllSignups(): Promise<NewsletterSignup[]> {
        return this.repo.find();
    }

    async signupNewUser( firstName: string, lastName: string, email: string,
        greeting: string | null,): Promise<{error: string, signup: NewsletterSignup}>
    {
        const signup = new NewsletterSignup();
        signup.firstName = firstName;
        signup.lastName = lastName;
        signup.email = email;
        signup.greeting = greeting;

        let user = await this.repo.findOneBy({ email });

        if (user) {
            if (user.isActive) {
                return {error: "Email already exists", signup: user};
            } else {
                user.isActive = true;
                user.cancellationReason = null;
                user.greeting = signup.greeting;
                user.firstName = signup.firstName;
                user.lastName = signup.lastName;
                await this.repo.save(user);
                return {error: null, signup: user}
            }
        } else {
            await this.repo.save(signup);
            return {error: null, signup: signup};
        }
    }

    async removeUser(email: string, reason: string | null): 
        Promise<{error: string, signup: NewsletterSignup}> 
    {

        let userToRemove = await this.repo.findOneBy({ email });
        if (!userToRemove) {
            return { error: "Email does not exist", signup: null }
        }

        userToRemove.isActive = false;
        userToRemove.cancellationReason = reason;

        await this.repo.save(userToRemove);

        return { error: null, signup: userToRemove};
    }
}