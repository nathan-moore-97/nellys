import fs from 'fs';
import { AppDataSource } from "../data-source";
import { GalleryImage } from "../entity/GalleryImage";
import path from 'path';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

export interface StorageService {
    getFromUrl(url: string): NonSharedBuffer;
    loadImages();
}

export class StorageServiceFactory {
    public static Create() {
        switch(process.env.ENVIORNMENT) {
            case "local":
                return new LocalStorageService();
            case "dev":
            case "prod":
                return new S3StorageService();
            default:
                throw new Error("No enviornment specified for StorageService");
        }
    }
}

export class LocalStorageService implements StorageService {
    loadImages() {
        fs.readdir(path.join(__dirname, '../../../photos'), async (err, files) => {

            if (err) {
                console.error(err);
                return;
            }

            const repo = AppDataSource.getRepository(GalleryImage);
            repo.clear();

            for (const filename of files) {
                const image = new GalleryImage();
                image.filename = filename;
                image.uploadDate = new Date();
                image.url = path.join(__dirname, '../../../photos', filename);
                repo.save(image);
            }
            
            console.log(`Loaded ${files.length} images`);
        });

    }

    getFromUrl(url: string): NonSharedBuffer {
        return fs.readFileSync(url);
    }
}

export class S3StorageService implements StorageService {
    async loadImages() {
        
        const repo = AppDataSource.getRepository(GalleryImage);
        repo.clear();

        const s3 = new S3Client({ region: "us-east-1" });
        const Bucket = process.env.GALLERY_BUCKET_NAME;

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

        console.log(`Loaded ${response.Contents.length} images`);
    }

    getFromUrl(url: string): NonSharedBuffer {
        throw new Error('Method not implemented.');
    }
}