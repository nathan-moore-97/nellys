import type { NewsletterSignup } from "./NewsletterModel";

export async function subscribeToNewsletter(params: NewsletterSignup): Promise<boolean> {

    console.log(params);

    const response = await fetch('http://localhost:3000/newsletter', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
    });

    if (!response.ok) {
        console.error(response);
    }

    const data = await response.json();

    return data.success;
}