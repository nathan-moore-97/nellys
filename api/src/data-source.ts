import "reflect-metadata";
import { DataSource } from "typeorm";
import { NewsletterSignup } from "./entity/NewsletterSignup";
import { GalleryImage } from "./entity/GalleryImage";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [NewsletterSignup, GalleryImage, User],
    migrations: [],
    subscribers: [],
});
