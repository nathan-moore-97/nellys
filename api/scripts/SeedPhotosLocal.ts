
import { DataSource } from "typeorm";
import { GalleryImage } from "../src/entity/GalleryImage";
import { NewsletterSignup } from "../src/entity/NewsletterSignup";

import  fs  from 'fs/promises';
import path from 'path';

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [NewsletterSignup, GalleryImage],
    migrations: [],
    subscribers: [],
});

AppDataSource.initialize().then(async () => {
    const files = await fs.readdir(path.join(__dirname, '../../photos'));
    const repo = AppDataSource.getRepository(GalleryImage);

    for (const filename of files) {
        console.log(`Saving ${filename}`);
        const image = new GalleryImage();
        image.filename = filename;
        image.uploadDate = new Date();
        image.url = path.join(__dirname, '../../photos', filename);
        repo.save(image);
    }
});