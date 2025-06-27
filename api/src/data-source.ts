import "reflect-metadata";
import { DataSource } from "typeorm";
import { NewsletterSignup } from "./entity/NewsletterSignup";
import { GalleryImage } from "./entity/GalleryImage";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [NewsletterSignup, GalleryImage],
    migrations: [],
    subscribers: [],
});
