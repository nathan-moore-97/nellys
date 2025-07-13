
import { DataSource } from "typeorm";
import { GalleryImage } from "../src/entity/GalleryImage";
import { NewsletterSignup } from "../src/entity/NewsletterSignup";

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [NewsletterSignup, GalleryImage],
    migrations: [],
    subscribers: [],
});

const s3 = new S3Client({ region: "us-east-1" });
const Bucket = process.env.GALLERY_BUCKET_NAME;

AppDataSource.initialize().then(async () => {
    const repo = AppDataSource.getRepository(GalleryImage);

    const response = await s3.send(
        new ListObjectsV2Command({ Bucket })
    );

    for (const file in response.Contents) {
        const trueFile = response.Contents[file];
        const image = new GalleryImage();

        image.filename = trueFile.Key;
        image.uploadDate = trueFile.LastModified || new Date();
        image.url = `https://${Bucket}.s3.amazonaws.com/${trueFile.Key}`;

        repo.save(image);
    }
});