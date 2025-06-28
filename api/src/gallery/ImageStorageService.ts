import multer from "multer";
import fs from 'fs';

export interface StorageService {
    upload(file: File): Promise<string>;
    getFromUrl(url: string): NonSharedBuffer;
}

export class LocalStorageService implements StorageService {
    upload(file: File): Promise<string> {
        
        throw new Error("Method not implemented.");
    }
    
    getFromUrl(url: string): NonSharedBuffer {
        return fs.readFileSync(url);
    }

}