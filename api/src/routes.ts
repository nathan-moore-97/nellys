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
        rateLimited: true,
        protected: false,
    },

    // Authentication
    {
        method: "post",
        route: "/auth/register",
        controller: AuthenticationController,
        action: "register",
        rateLimited: true,
        protected: false,
    }, 
    {
        method: "post", 
        route: "/auth",
        controller: AuthenticationController,
        action: "authenticate", 
        rateLimited: true,
        protected: false,
    },
    {
        method: "post", 
        route: "/auth/refresh",
        controller: AuthenticationController,
        action: "refreshToken", 
        rateLimited: true,
        protected: false,
    },

    // Newsletter Signup Routes
    {
        method: "post",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "save",
        rateLimited: false,
        protected: false,
    }, 
    {
        method: "delete",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "remove",
        rateLimited: false,
        protected: false,
    },
    {
        method: "get",
        route: "/newsletter",
        controller: NewsletterSignupController,
        action: "all",
        rateLimited: false, 
        protected: true,
    },

    // Gallery
    {
        method: "post",
        route: "/gallery",
        controller: GalleryController,
        action: "getAllPhotos",
        rateLimited: false,
        protected: false,
    },
    {
        method: "get",
        route: "/gallery/:photoId",
        controller: GalleryController,
        action: "getPhoto",
        rateLimited: false,
        protected: false,
    }
]