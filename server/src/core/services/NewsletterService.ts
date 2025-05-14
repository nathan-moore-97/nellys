interface INewsletter {
    subscribe(params: NewsletterSignup): Promise<boolean>;
    unsubscribe(email: string): Promise<boolean>;
}

class NewsletterService implements INewsletter {
    async subscribe(params: NewsletterSignup): Promise<boolean> {
        console.log(`${params.email} has successfully subscribed`);
        return true;
    }

    async unsubscribe(email: string): Promise<boolean> { 
       console.log(`${email} has successfully unsubscribed`);
       return true;
    }
}

export default NewsletterService;