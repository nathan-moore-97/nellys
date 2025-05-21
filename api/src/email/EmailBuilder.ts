import { NewsletterSignup } from "../entity/NewsletterSignup";

export class Email {
    subject: string = "";
    body: string = "";
}

export class EmailBuilder {

    email: Email;

    constructor() {
        this.email = new Email();
    }

    addSubject(subject: string): EmailBuilder {
        this.email.subject = subject;
        return this;
    }

    addField(label: string, content: string): EmailBuilder {
        this.email.body += `<p><strong>${label}</strong>: ${content}</p>`;
        return this;
    }

    addTestimonial(content: string): EmailBuilder {
        this.email.body += `<p><i>${content}</i></p>`
        return this;
    }

    addContent(content: string) {
        this.email.body += `<p>${content}</p>`
        return this;
    }

    addHeader(header: string, component: string = "h1"): EmailBuilder {
        this.email.body += `<${component}>${header}</${component}>`
        return this;
    }

    addUnsubscribeLink(email_addr: string): EmailBuilder {
        this.email.body += `<a href="${process.env.WEB_APP_ROOT_URL}/unsubscribe?email=${email_addr}">Unsubscribe</a>`;
        return this;
    }
}

export class EmailDirector {
    static welcome(signup: NewsletterSignup): Email {
        return new EmailBuilder()
            .addSubject(`Welcome, ${signup.firstName}!`)
            .addContent("Thank you for signing up for the Nelly's Needlers Newsletter!")
            .addContent("You will now recieve periodic emails with Nelly's news, events and promotions. " +
                "As our email system is not yet fully automated, please allow for a few days for your " +
                "signup request to be processed.")
            .addContent("Thank you!")
            .addUnsubscribeLink(signup.email)
            .email;
    }

    static goodbye(signup: NewsletterSignup): Email {
        return new EmailBuilder()
            .addSubject("Sorry to see you go!")
            .addContent("You will be removed from the Nelly's Newsletter.")
            .addContent("As our email system is not yet fully automated, please allow for a few days for your " +
                "signup request to be processed.")
            .email;
    }

    static signUpNotification(signup: NewsletterSignup): Email {
        let builder = new EmailBuilder()
            .addSubject("Newsletter Signup Request")
            .addHeader("New Newsletter Signup")
            .addField("Name", `${signup.firstName} ${signup.lastName}`)
            .addField("Email", `${signup.email}`);

        if (signup.greeting) {
            builder.addTestimonial(signup.greeting);
        }

        // Add link to the relevant signup page

        return builder.email;
    }

    static unsubscribeNotification(signup: NewsletterSignup): Email {
        let builder = new EmailBuilder()
            .addSubject("Newsletter Removal Request")
            .addHeader("New Newsletter Removal")
            .addField("Name", `${signup.firstName} ${signup.lastName}`)
            .addField("Email", `${signup.email}`);

        if (signup.greeting) {
            builder.addTestimonial(signup.cancellationReason);
        }

        // Add link to the relevant signup page

        return builder.email;
    }
}

