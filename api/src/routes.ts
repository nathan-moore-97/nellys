import { NewsletterSignupController } from "./controller/NewsletterSignupController"
import { ApiHealthController } from "./controller/ApiHealthController";
import { GalleryController } from "./controller/GalleryController";

export const Routes = [
    
    // Health endpoint
    {
        method: "get",
        route: "/health",
        controller: ApiHealthController,
        action: "all"
    },

    // Newsletter Signup Routes
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
        // TODO: secure this endpoint behind some kind of authentication
        method: "get",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "all"
    },

    // Gallery
    {
        method: "get",
        route: "/gallery",
        controller: GalleryController,
        action: "getAllPhotos"
    }
]