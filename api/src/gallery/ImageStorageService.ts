import fs from 'fs';
import { AppDataSource } from "../data-source";
import { GalleryImage } from "../entity/GalleryImage";

export interface StorageService {
    getFromUrl(url: string): NonSharedBuffer;
}

export class LocalStorageService implements StorageService {
    getFromUrl(url: string): NonSharedBuffer {
        return fs.readFileSync(url);
    }

}

export class S3StorageService implements StorageService {
    getFromUrl(url: string): NonSharedBuffer {
        throw new Error('Method not implemented.');
    }
}