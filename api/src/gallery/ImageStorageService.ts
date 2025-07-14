import fs from 'fs';
import { AppDataSource } from "../data-source";
import { GalleryImage } from "../entity/GalleryImage";
import path from 'path';
import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import logger from '../logging/Logger';

export interface StorageService {
    getFrom(image: GalleryImage): Promise<NonSharedBuffer>;
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
            
            logger.info(`Loaded ${files.length} images`);
        });

    }

    async getFrom(image: GalleryImage): Promise<NonSharedBuffer> {
        return await fs.readFileSync(image.url);
    }
}

export class S3StorageService implements StorageService {
    
    s3: S3Client = new S3Client({ region: "us-east-1" });
    bucketName = process.env.GALLERY_BUCKET_NAME;

    async loadImages() {
        const repo = AppDataSource.getRepository(GalleryImage);
        repo.clear();

        const Bucket = this.bucketName;

        const response = await this.s3.send(
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

        logger.info(`Loaded ${response.Contents.length} images`);
    }

    async getFrom(image: GalleryImage): Promise<NonSharedBuffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: image.filename,
        });

        const response = await this.s3.send(command);
        if (!response.Body) {
            throw new Error(`Empty response from S3`);
        }

        return await this.streamToBuffer(response.Body as Readable);
    }

    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
}