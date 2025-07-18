import { NewsletterSignupController } from "./controller/NewsletterSignupController"
import { ApiHealthController } from "./controller/ApiHealthController";
import { GalleryController } from "./controller/GalleryController";
import { AuthenticationController } from "./controller/AuthenticationController";

export const Routes = [
    
    // Health endpoint
    {
        method: "get",
        route: "/health",
        controller: ApiHealthController,
        action: "all",
        protected: true,
    },

    // Authentication
    {
        method: "post",
        route: "/auth/register",
        controller: AuthenticationController,
        action: "register",
        protected: true,
    }, 
    {
        method: "post", 
        route: "/auth",
        controller: AuthenticationController,
        action: "authenticate", 
        protected: true,
    },

    // Newsletter Signup Routes
    {
        method: "post",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "save",
        protected: false,
    }, 
    {
        method: "delete",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "remove",
        protected: false,
    },
    {
        // TODO: secure this endpoint behind some kind of authentication
        method: "get",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "all",
        protected: false,
        authenticated: true,
    },

    // Gallery
    {
        method: "post",
        route: "/gallery",
        controller: GalleryController,
        action: "getAllPhotos",
        protected: false,
    },
    {
        method: "get",
        route: "/gallery/:photoId",
        controller: GalleryController,
        action: "getPhoto",
        protected: false,
    }
]