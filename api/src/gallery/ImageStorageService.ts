import fs from 'fs';
import { AppDataSource } from "../data-source";
import { GalleryImage } from "../entity/GalleryImage";

export interface StorageService {
    upload(image: GalleryImage): Promise<string>;
    getFromUrl(url: string): NonSharedBuffer;
}

export class LocalStorageService implements StorageService {
    
    private repo = AppDataSource.getRepository(GalleryImage);

    upload(image: GalleryImage): Promise<string> {
        this.repo.save(image);
        
        return new Promise<string>((res) => {
            res(image.url);
        });
    }
    
    getFromUrl(url: string): NonSharedBuffer {
        return fs.readFileSync(url);
    }

}

export class S3StorageService implements StorageService {
    upload(image: GalleryImage): Promise<string> {
        throw new Error('Method not implemented.');
    }
    getFromUrl(url: string): NonSharedBuffer {
        throw new Error('Method not implemented.');
    }
}