import { NewsletterSignupController } from "./controller/NewsletterSignupController"
import { ApiHealthController } from "./controller/ApiHealthController";
import { GalleryController } from "./controller/GalleryController";
import { AuthenticationController } from "./controller/AuthenticationController";
import rateLimit from "express-rate-limit";
import { User, UserRole } from "./entity/User";
import { AdminController } from "./controller/AdminController";
import { Admin } from "typeorm";

export const Routes = [
    
    // Health
    {
        method: "get",
        route: "/health",
        controller: ApiHealthController,
        action: "all",
        rateLimited: true,
        protected: false,
    },

    // Admin and Management
    {
        method: "post",
        route: "/admin/users/role",
        action: "setRole",
        controller: AdminController,
        rateLimited: true,
        protected: true,
        requires: UserRole.ADMIN
    },
    {
        method: "get",
        route: "/admin/users",
        action: "all",
        controller: AdminController,
        rateLimited: true,
        protected: true,
        requires: UserRole.ADMIN
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
        route: "/auth/logout",
        controller: AuthenticationController,
        action: "clear",
        rateLimited: true,
        protected: true,
    },
    {
        method: "post", 
        route: "/auth/refresh",
        controller: AuthenticationController,
        action: "refreshToken", 
        rateLimited: true,
        protected: false,
    },

    // Newsletter Signups
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
        requires: UserRole.BOARD,
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