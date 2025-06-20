import { NewsletterSignupController } from "./controller/NewsletterSignupController"
import { ApiHealthController } from "./controller/ApiHealthController";

export const Routes = [
    {
        method: "post",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "save"
    }, 
    {
        method: "delete",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "remove"
    },
    {
        method: "get",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "all"
    },
    {
        method: "get",
        route: "/health",
        controller: ApiHealthController,
        action: "all"
    }
]