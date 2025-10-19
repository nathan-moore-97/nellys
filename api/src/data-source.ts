import "reflect-metadata";
import { DataSource } from "typeorm";
import { NewsletterSignup } from "./entity/NewsletterSignup";
import { GalleryImage } from "./entity/GalleryImage";
import { User } from "./entity/User";
import { UserRegistration } from "./entity/UserRegistration";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: process.env.NODE_ENV === "prod" 
        ? "/app/data/database.sqlite" 
        : "database.sqlite",
    synchronize: process.env.NODE_ENV !== "prod",
    logging: false,
    entities: [NewsletterSignup, GalleryImage, User, UserRegistration],
    migrations: [],
    subscribers: [],
});