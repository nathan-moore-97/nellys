import { NewsletterSignup } from "../models/NewsletterSignup";

interface INewsletter {
    subscribe(params: NewsletterSignup): Promise<boolean>;
    unsubscribe(email: string): Promise<boolean>;
}

class NewsletterService implements INewsletter {
    async subscribe(params: NewsletterSignup): Promise<boolean> {
        console.log(`${params.email} has successfully subscribed`);
        // Send welcome email
        // POST new user to database
        return true;
    }

    async unsubscribe(email: string): Promise<boolean> { 
       console.log(`${email} has successfully unsubscribed`);
       // Remove user from database
       return true;
    }
}

export default NewsletterService;